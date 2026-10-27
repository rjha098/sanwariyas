// // FILE: server/services/lookbookPdfService.js
// // Turns an uploaded catalogue PDF into optimised WebP assets.
// //
// //  • Pages are rendered with poppler (pdftoppm) – the FULL page, never cropped.
// //  • Embedded product photos are extracted with pdfimages and kept only when
// //    they are large enough and are not simply a full-page scan.
// //  • Images are optimised/encoded with sharp (loaded lazily so the API still
// //    boots if the dependency has not been installed yet).
// //  • Processing is idempotent: every asset has a deterministic sourceKey, so a
// //    retry only creates what is missing and never duplicates records.
// //  • One catalogue is processed at a time (in-process queue) to cap CPU/RAM.
// import fs from "fs";
// import fsp from "fs/promises";
// import path from "path";
// import crypto from "crypto";
// import { execFile } from "child_process";
// import { fileURLToPath } from "url";
// import Lookbook from "../models/Lookbook.js";
// import LookbookCatalogue from "../models/LookbookCatalogue.js";
// import Counter from "../models/Counter.js";
// import { getLookbookConfig } from "../utils/lookbookConfig.js";
// import {
//   parsePageCount,
//   parsePageSize,
//   parseImageList,
//   isFullPageImage,
// } from "../utils/pdfParsing.js";

// const __dirname = path.dirname(fileURLToPath(import.meta.url));
// const SERVER_ROOT = path.join(__dirname, "..");

// export const CATALOGUE_UPLOAD_ROOT = path.join(
//   SERVER_ROOT,
//   "uploads",
//   "lookbook",
//   "catalogues",
// );
// export const PDF_STORE_ROOT = path.join(
//   SERVER_ROOT,
//   "storage",
//   "lookbook-pdfs",
// );
// const WORK_ROOT = path.join(SERVER_ROOT, "storage", "lookbook-work");

// const OBJECT_ID_RE = /^[a-f\d]{24}$/i;
// export const isObjectId = (v) => typeof v === "string" && OBJECT_ID_RE.test(v);

// export const publicAssetPath = (catalogueId, fileName) =>
//   `/uploads/lookbook/catalogues/${catalogueId}/${fileName}`;

// export const pdfPathFor = (catalogueId) => {
//   if (!isObjectId(String(catalogueId))) throw new Error("Invalid catalogue id");
//   return path.join(PDF_STORE_ROOT, `${catalogueId}.pdf`);
// };

// const catalogueDirFor = (catalogueId) => {
//   if (!isObjectId(String(catalogueId))) throw new Error("Invalid catalogue id");
//   const dir = path.join(CATALOGUE_UPLOAD_ROOT, String(catalogueId));
//   if (!dir.startsWith(CATALOGUE_UPLOAD_ROOT + path.sep)) {
//     throw new Error("Unsafe catalogue path");
//   }
//   return dir;
// };

// // ── external tools ────────────────────────────────────────────────────────
// const run = (bin, args, timeout) =>
//   new Promise((resolve, reject) => {
//     execFile(
//       bin,
//       args,
//       { timeout, maxBuffer: 16 * 1024 * 1024, windowsHide: true },
//       (err, stdout, stderr) => {
//         if (err) {
//           err.stderr = stderr;
//           return reject(err);
//         }
//         return resolve({ stdout, stderr });
//       },
//     );
//   });

// let sharpModule = null;
// const loadSharp = async () => {
//   if (sharpModule) return sharpModule;
//   const mod = await import("sharp");
//   const sharp = mod.default || mod;
//   sharp.cache(false);
//   sharp.concurrency(1);
//   sharpModule = sharp;
//   return sharp;
// };

// // Throws an Error with .status = 503 when the host cannot process PDFs.
// export const assertToolsAvailable = async () => {
//   const cfg = getLookbookConfig();
//   const missing = [];
//   for (const [name, bin, flag] of [
//     ["pdfinfo", cfg.pdfinfo, "-v"],
//     ["pdftoppm", cfg.pdftoppm, "-v"],
//     ["pdfimages", cfg.pdfimages, "-v"],
//   ]) {
//     try {
//       await run(bin, [flag], 10000);
//     } catch (err) {
//       // poppler prints its version banner to stderr and some builds exit 0/99.
//       if (err.code === "ENOENT") missing.push(name);
//     }
//   }
//   if (missing.length) {
//     const e = new Error(
//       `PDF tools missing on the server (${missing.join(", ")}). Install poppler-utils.`,
//     );
//     e.status = 503;
//     throw e;
//   }
//   try {
//     await loadSharp();
//   } catch {
//     const e = new Error(
//       "Image library 'sharp' is not installed on the server. Run npm install in /server.",
//     );
//     e.status = 503;
//     throw e;
//   }
// };

// // ── PDF inspection ────────────────────────────────────────────────────────
// export const inspectPdf = async (pdfPath) => {
//   const cfg = getLookbookConfig();
//   let stdout;
//   try {
//     ({ stdout } = await run(cfg.pdfinfo, [pdfPath], 30000));
//   } catch (err) {
//     const stderr = String(err.stderr || "");
//     const e = new Error(
//       /password/i.test(stderr)
//         ? "This PDF is password-protected and cannot be processed."
//         : "This file could not be read as a valid PDF.",
//     );
//     e.status = 400;
//     throw e;
//   }
//   const pages = parsePageCount(stdout);
//   if (pages < 1) {
//     const e = new Error("The PDF has no readable pages.");
//     e.status = 400;
//     throw e;
//   }
//   return { pages };
// };

// const pageSizePts = async (pdfPath, page) => {
//   const cfg = getLookbookConfig();
//   try {
//     const { stdout } = await run(
//       cfg.pdfinfo,
//       ["-f", String(page), "-l", String(page), pdfPath],
//       30000,
//     );
//     return parsePageSize(stdout, page);
//   } catch {
//     return null;
//   }
// };

// // ── image helpers ─────────────────────────────────────────────────────────
// const fileExists = async (p) => {
//   try {
//     await fsp.access(p);
//     return true;
//   } catch {
//     return false;
//   }
// };

// const sha1File = (filePath) =>
//   new Promise((resolve, reject) => {
//     const hash = crypto.createHash("sha1");
//     fs.createReadStream(filePath)
//       .on("error", reject)
//       .on("data", (c) => hash.update(c))
//       .on("end", () => resolve(hash.digest("hex")));
//   });

// // Writes full / display / thumb WebP variants. Output is written to a
// // .partial file first and renamed, so an interrupted run never leaves a
// // truncated image that a retry would mistake for a finished one.
// const writeVariants = async (srcPath, outDir, baseName) => {
//   const cfg = getLookbookConfig();
//   const sharp = await loadSharp();
//   await fsp.mkdir(outDir, { recursive: true });

//   const plan = [
//     ["full", cfg.fullMaxPx, cfg.webpQuality],
//     ["display", cfg.displayMaxPx, Math.max(cfg.webpQuality - 3, 40)],
//     ["thumb", cfg.thumbMaxPx, Math.max(cfg.webpQuality - 10, 40)],
//   ];
//   const files = {};
//   let width = null;
//   let height = null;

//   for (const [variant, maxPx, quality] of plan) {
//     const fileName = `${baseName}-${variant}.webp`;
//     const finalPath = path.join(outDir, fileName);
//     const partialPath = `${finalPath}.partial`;
//     const info = await sharp(srcPath, { limitInputPixels: cfg.maxInputPixels })
//       .flatten({ background: "#ffffff" })
//       .resize({
//         width: maxPx,
//         height: maxPx,
//         fit: "inside",
//         withoutEnlargement: true,
//       })
//       .webp({ quality, effort: 4 })
//       .toFile(partialPath);
//     await fsp.rename(partialPath, finalPath);
//     files[variant] = fileName;
//     if (variant === "full") {
//       width = info.width;
//       height = info.height;
//     }
//   }
//   return { files, width, height };
// };

// const variantsExist = async (outDir, baseName) => {
//   for (const v of ["full", "display", "thumb"]) {
//     if (!(await fileExists(path.join(outDir, `${baseName}-${v}.webp`)))) {
//       return false;
//     }
//   }
//   return true;
// };

// const nextStyleNumber = async () => {
//   for (let i = 0; i < 20; i++) {
//     const counter = await Counter.findOneAndUpdate(
//       { _id: "lookbookStyle" },
//       { $inc: { seq: 1 } },
//       { new: true, upsert: true, setDefaultsOnInsert: false },
//     );
//     const code = `SW-${String(counter.seq).padStart(4, "0")}`;
//     if (!(await Lookbook.exists({ styleNumber: code }))) return code;
//   }
//   return `SW-${Date.now()}`;
// };

// const upsertItem = async ({
//   catalogue,
//   sourceKey,
//   sourceType,
//   pageNumber,
//   title,
//   sortOrder,
//   isPublished,
//   contentHash,
//   variants,
// }) => {
//   const catalogueId = catalogue._id;
//   const category =
//     String(catalogue.collectionName || catalogue.title || "Catalogue").slice(
//       0,
//       80,
//     ) || "Catalogue";
//   const fileFields = {
//     image: publicAssetPath(catalogueId, variants.files.display),
//     display: publicAssetPath(catalogueId, variants.files.display),
//     full: publicAssetPath(catalogueId, variants.files.full),
//     thumb: publicAssetPath(catalogueId, variants.files.thumb),
//     width: variants.width,
//     height: variants.height,
//   };

//   const existing = await Lookbook.findOne({ sourceKey }).select("_id").lean();
//   if (existing) {
//     // Retry path: refresh file references only – keep admin edits intact.
//     await Lookbook.updateOne({ _id: existing._id }, { $set: fileFields });
//     return existing._id;
//   }
//   const styleNumber = await nextStyleNumber();
//   const doc = await Lookbook.create({
//     ...fileFields,
//     title,
//     styleNumber,
//     category,
//     catalogueId,
//     sourceType,
//     pageNumber,
//     sourceKey,
//     contentHash,
//     sortOrder,
//     isPublished,
//   });
//   return doc._id;
// };

// // ── per-page work ─────────────────────────────────────────────────────────
// const renderPageToPng = async (pdfPath, page, workDir, cfg) => {
//   const prefix = path.join(workDir, `page-${page}`);
//   await run(
//     cfg.pdftoppm,
//     [
//       "-png",
//       "-singlefile",
//       "-scale-to",
//       String(cfg.fullMaxPx),
//       "-f",
//       String(page),
//       "-l",
//       String(page),
//       pdfPath,
//       prefix,
//     ],
//     cfg.toolTimeoutMs,
//   );
//   return `${prefix}.png`;
// };

// const listPageImages = async (pdfPath, page, cfg) => {
//   const { stdout } = await run(
//     cfg.pdfimages,
//     ["-list", "-f", String(page), "-l", String(page), pdfPath],
//     cfg.toolTimeoutMs,
//   );
//   return parseImageList(stdout);
// };

// const extractPageImages = async (pdfPath, page, workDir, cfg) => {
//   const prefix = path.join(workDir, `img-${page}`);
//   await run(
//     cfg.pdfimages,
//     ["-png", "-f", String(page), "-l", String(page), pdfPath, prefix],
//     cfg.toolTimeoutMs,
//   );
// };

// const touch = (id, set) =>
//   LookbookCatalogue.updateOne({ _id: id }, { $set: set });

// const processEmbedded = async ({
//   catalogue,
//   pdfPath,
//   page,
//   workDir,
//   outDir,
//   cfg,
//   report,
// }) => {
//   if (cfg.maxEmbeddedPerPage === 0) return;
//   const rows = await listPageImages(pdfPath, page, cfg);
//   if (!rows.length) return;
//   const size = await pageSizePts(pdfPath, page);

//   const candidates = [];
//   rows.forEach((row, index) => {
//     if (row.type !== "image") return; // masks / stencils are not photos
//     if (row.width < cfg.minEmbeddedPx || row.height < cfg.minEmbeddedPx) {
//       report.embeddedSkippedSmall += 1;
//       return;
//     }
//     // Full-page scan: the rendered page already IS this image.
//     if (isFullPageImage(row, size)) {
//       report.embeddedSkippedFullPage += 1;
//       return;
//     }
//     candidates.push(index);
//   });
//   if (!candidates.length) return;

//   await extractPageImages(pdfPath, page, workDir, cfg);

//   let kept = 0;
//   for (const index of candidates) {
//     if (kept >= cfg.maxEmbeddedPerPage) break;
//     const file = path.join(
//       workDir,
//       `img-${page}-${String(index).padStart(3, "0")}.png`,
//     );
//     if (!(await fileExists(file))) {
//       report.embeddedSkippedFailed += 1;
//       continue;
//     }
//     try {
//       const hash = await sha1File(file);
//       const sourceKey = `${catalogue._id}:img:${hash}`;
//       const baseName = `img-${hash.slice(0, 16)}`;
//       const existing = await Lookbook.exists({ sourceKey });
//       if (existing && (await variantsExist(outDir, baseName))) {
//         report.embeddedSkippedDuplicate += 1;
//         continue;
//       }
//       const variants = await writeVariants(file, outDir, baseName);
//       await upsertItem({
//         catalogue,
//         sourceKey,
//         sourceType: "embedded",
//         pageNumber: page,
//         title: `${catalogue.title} – Page ${page} photo ${kept + 1}`,
//         sortOrder: page * 100 + (kept + 1),
//         isPublished: false, // admin opts embedded photos in after review
//         contentHash: hash,
//         variants,
//       });
//       report.embeddedExtracted += 1;
//       kept += 1;
//     } catch (err) {
//       report.embeddedSkippedFailed += 1;
//       console.error(
//         `[lookbook-pdf] embedded image failed (catalogue ${catalogue._id}, page ${page}): ${err.message}`,
//       );
//     } finally {
//       await fsp.rm(file, { force: true });
//     }
//   }
// };

// // ── main job ──────────────────────────────────────────────────────────────
// export const processCatalogue = async (catalogueId) => {
//   const id = String(catalogueId);
//   const cfg = getLookbookConfig();
//   let workDir = "";
//   try {
//     const catalogue = await LookbookCatalogue.findById(id);
//     if (!catalogue || catalogue.status !== "processing") return;

//     await assertToolsAvailable();
//     const pdfPath = pdfPathFor(id);
//     if (!(await fileExists(pdfPath))) {
//       throw new Error(
//         "The source PDF is no longer on the server. Please delete this catalogue and upload the PDF again.",
//       );
//     }

//     const { pages } = await inspectPdf(pdfPath);
//     if (pages > cfg.maxPages) {
//       throw new Error(
//         `PDF has ${pages} pages; the configured limit is ${cfg.maxPages}.`,
//       );
//     }

//     await fsp.mkdir(WORK_ROOT, { recursive: true });
//     workDir = await fsp.mkdtemp(path.join(WORK_ROOT, `${id}-`));
//     const outDir = catalogueDirFor(id);
//     await fsp.mkdir(outDir, { recursive: true });

//     const done = new Set(catalogue.donePages || []);
//     const report = {
//       pagesRendered: catalogue.report?.pagesRendered || 0,
//       embeddedExtracted: 0,
//       embeddedSkippedSmall: 0,
//       embeddedSkippedDuplicate: 0,
//       embeddedSkippedFullPage: 0,
//       embeddedSkippedFailed: 0,
//     };
//     const failedPages = [];
//     const warnings = [];

//     await touch(id, {
//       totalPages: pages,
//       stage: "Rendering pages",
//       startedAt: catalogue.startedAt || new Date(),
//       failedPages: [],
//       error: "",
//     });

//     for (let page = 1; page <= pages; page++) {
//       const pageKey = `${id}:p${page}:page`;
//       const baseName = `p${String(page).padStart(4, "0")}`;

//       try {
//         const pageItemOk =
//           done.has(page) &&
//           (await Lookbook.exists({ sourceKey: pageKey })) &&
//           (await variantsExist(outDir, baseName));

//         if (!pageItemOk) {
//           const png = await renderPageToPng(pdfPath, page, workDir, cfg);
//           try {
//             const variants = await writeVariants(png, outDir, baseName);
//             await upsertItem({
//               catalogue,
//               sourceKey: pageKey,
//               sourceType: "page",
//               pageNumber: page,
//               title: `${catalogue.title} – Page ${page}`,
//               sortOrder: page * 100,
//               isPublished: true,
//               contentHash: "",
//               variants,
//             });
//           } finally {
//             await fsp.rm(png, { force: true });
//           }
//           report.pagesRendered += 1;

//           try {
//             await processEmbedded({
//               catalogue,
//               pdfPath,
//               page,
//               workDir,
//               outDir,
//               cfg,
//               report,
//             });
//           } catch (err) {
//             warnings.push(
//               `Page ${page}: embedded photo extraction failed (${err.message}). The full page image was kept.`,
//             );
//           }
//         }

//         done.add(page);
//         await touch(id, {
//           donePages: Array.from(done).sort((a, b) => a - b),
//           stage: `Processed page ${page} of ${pages}`,
//           "report.pagesRendered": report.pagesRendered,
//         });
//       } catch (err) {
//         failedPages.push(page);
//         console.error(
//           `[lookbook-pdf] page ${page} failed (catalogue ${id}): ${err.message}`,
//         );
//       }
//     }

//     const finalDone = Array.from(done).sort((a, b) => a - b);
//     const prevReport = catalogue.report?.toObject?.() || {};
//     const mergedReport = {
//       pagesRendered: finalDone.length,
//       embeddedExtracted:
//         (prevReport.embeddedExtracted || 0) + report.embeddedExtracted,
//       embeddedSkippedSmall:
//         (prevReport.embeddedSkippedSmall || 0) + report.embeddedSkippedSmall,
//       embeddedSkippedDuplicate:
//         (prevReport.embeddedSkippedDuplicate || 0) +
//         report.embeddedSkippedDuplicate,
//       embeddedSkippedFullPage:
//         (prevReport.embeddedSkippedFullPage || 0) +
//         report.embeddedSkippedFullPage,
//       embeddedSkippedFailed:
//         (prevReport.embeddedSkippedFailed || 0) + report.embeddedSkippedFailed,
//     };

//     if (failedPages.length) {
//       await touch(id, {
//         status: "failed",
//         stage: "Needs retry",
//         failedPages,
//         report: mergedReport,
//         warnings,
//         finishedAt: new Date(),
//         error: `${failedPages.length} page(s) could not be processed: ${failedPages
//           .slice(0, 20)
//           .join(
//             ", ",
//           )}${failedPages.length > 20 ? "…" : ""}. Retry to process only the missing pages.`,
//       });
//       return;
//     }

//     await touch(id, {
//       status: "draft",
//       stage: "Ready for review",
//       failedPages: [],
//       report: mergedReport,
//       warnings,
//       error: "",
//       finishedAt: new Date(),
//     });
//     // Source PDF is only needed for retries – free the disk once everything worked.
//     await fsp.rm(pdfPath, { force: true });
//   } catch (err) {
//     console.error(`[lookbook-pdf] catalogue ${id} failed: ${err.message}`);
//     try {
//       await LookbookCatalogue.updateOne(
//         { _id: id },
//         {
//           $set: {
//             status: "failed",
//             stage: "Needs retry",
//             error: String(err.message || "Processing failed").slice(0, 900),
//             finishedAt: new Date(),
//           },
//         },
//       );
//     } catch (dbErr) {
//       console.error(
//         `[lookbook-pdf] could not record failure: ${dbErr.message}`,
//       );
//     }
//   } finally {
//     if (workDir) await fsp.rm(workDir, { recursive: true, force: true });
//   }
// };

// // ── in-process queue (one catalogue at a time) ────────────────────────────
// const queue = [];
// const active = new Set();
// let draining = false;

// export const isCatalogueBusy = (id) =>
//   active.has(String(id)) || queue.includes(String(id));

// const drain = async () => {
//   if (draining) return;
//   draining = true;
//   try {
//     while (queue.length) {
//       const id = queue.shift();
//       active.add(id);
//       try {
//         await processCatalogue(id);
//       } catch (err) {
//         console.error(`[lookbook-pdf] worker error: ${err.message}`);
//       } finally {
//         active.delete(id);
//       }
//     }
//   } finally {
//     draining = false;
//   }
// };

// export const enqueueCatalogue = (id) => {
//   const key = String(id);
//   if (isCatalogueBusy(key)) return;
//   queue.push(key);
//   // Detached on purpose: processCatalogue never rejects, drain catches the rest.
//   drain().catch((err) =>
//     console.error(`[lookbook-pdf] drain error: ${err.message}`),
//   );
// };

// // After a crash / restart / nodemon reload the in-memory queue is lost and a
// // catalogue would stay "processing" forever. Processing is idempotent, so
// // re-queueing continues from the pages that are already done.
// export const resumeInterruptedCatalogues = async () => {
//   try {
//     const stuck = await LookbookCatalogue.find({ status: "processing" })
//       .select("_id")
//       .lean();
//     stuck.forEach((c) => enqueueCatalogue(c._id));
//     if (stuck.length) {
//       console.log(
//         `[lookbook-pdf] resumed ${stuck.length} interrupted catalogue(s)`,
//       );
//     }
//   } catch (err) {
//     console.error(`[lookbook-pdf] resume failed: ${err.message}`);
//   }
// };

// // ── cleanup ───────────────────────────────────────────────────────────────
// export const removeCatalogueAssets = async (catalogueId) => {
//   const dir = catalogueDirFor(catalogueId);
//   await fsp.rm(dir, { recursive: true, force: true });
//   await fsp.rm(pdfPathFor(catalogueId), { force: true });
// };

// FILE: server/services/lookbookPdfService.js
// Turns an uploaded catalogue PDF into optimised WebP assets.
//
//  • Pages are rendered with poppler (pdftoppm) – the FULL page, never cropped.
//  • Embedded product photos are extracted with pdfimages and kept only when
//    they are large enough and are not simply a full-page scan.
//  • Images are optimised/encoded with sharp (loaded lazily so the API still
//    boots if the dependency has not been installed yet).
//  • Processing is idempotent: every asset has a deterministic sourceKey, so a
//    retry only creates what is missing and never duplicates records.
//  • One catalogue is processed at a time (in-process queue) to cap CPU/RAM.
import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import crypto from "crypto";
import { execFile } from "child_process";
import { readPageLabel } from "../utils/pageLabel.js";
import { fileURLToPath } from "url";
import Lookbook from "../models/Lookbook.js";
import LookbookCatalogue from "../models/LookbookCatalogue.js";
import Counter from "../models/Counter.js";
import { getLookbookConfig } from "../utils/lookbookConfig.js";
import {
  parsePageCount,
  parsePageSize,
  parseImageList,
  isFullPageImage,
} from "../utils/pdfParsing.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SERVER_ROOT = path.join(__dirname, "..");

export const CATALOGUE_UPLOAD_ROOT = path.join(
  SERVER_ROOT,
  "uploads",
  "lookbook",
  "catalogues",
);
export const PDF_STORE_ROOT = path.join(
  SERVER_ROOT,
  "storage",
  "lookbook-pdfs",
);
const WORK_ROOT = path.join(SERVER_ROOT, "storage", "lookbook-work");

const OBJECT_ID_RE = /^[a-f\d]{24}$/i;
export const isObjectId = (v) => typeof v === "string" && OBJECT_ID_RE.test(v);

export const publicAssetPath = (catalogueId, fileName) =>
  `/uploads/lookbook/catalogues/${catalogueId}/${fileName}`;

export const pdfPathFor = (catalogueId) => {
  if (!isObjectId(String(catalogueId))) throw new Error("Invalid catalogue id");
  return path.join(PDF_STORE_ROOT, `${catalogueId}.pdf`);
};

const catalogueDirFor = (catalogueId) => {
  if (!isObjectId(String(catalogueId))) throw new Error("Invalid catalogue id");
  const dir = path.join(CATALOGUE_UPLOAD_ROOT, String(catalogueId));
  if (!dir.startsWith(CATALOGUE_UPLOAD_ROOT + path.sep)) {
    throw new Error("Unsafe catalogue path");
  }
  return dir;
};

// ── external tools ────────────────────────────────────────────────────────
const run = (bin, args, timeout) =>
  new Promise((resolve, reject) => {
    execFile(
      bin,
      args,
      { timeout, maxBuffer: 16 * 1024 * 1024, windowsHide: true },
      (err, stdout, stderr) => {
        if (err) {
          err.stderr = stderr;
          return reject(err);
        }
        return resolve({ stdout, stderr });
      },
    );
  });

let sharpModule = null;
const loadSharp = async () => {
  if (sharpModule) return sharpModule;
  const mod = await import("sharp");
  const sharp = mod.default || mod;
  sharp.cache(false);
  sharp.concurrency(1);
  sharpModule = sharp;
  return sharp;
};

// Throws an Error with .status = 503 when the host cannot process PDFs.
export const assertToolsAvailable = async () => {
  const cfg = getLookbookConfig();
  const missing = [];
  for (const [name, bin, flag] of [
    ["pdfinfo", cfg.pdfinfo, "-v"],
    ["pdftoppm", cfg.pdftoppm, "-v"],
    ["pdfimages", cfg.pdfimages, "-v"],
  ]) {
    try {
      await run(bin, [flag], 10000);
    } catch (err) {
      // poppler prints its version banner to stderr and some builds exit 0/99.
      if (err.code === "ENOENT") missing.push(name);
    }
  }
  if (missing.length) {
    const e = new Error(
      `PDF tools missing on the server (${missing.join(", ")}). Install poppler-utils.`,
    );
    e.status = 503;
    throw e;
  }
  try {
    await loadSharp();
  } catch {
    const e = new Error(
      "Image library 'sharp' is not installed on the server. Run npm install in /server.",
    );
    e.status = 503;
    throw e;
  }
};

// ── PDF inspection ────────────────────────────────────────────────────────
export const inspectPdf = async (pdfPath) => {
  const cfg = getLookbookConfig();
  let stdout;
  try {
    ({ stdout } = await run(cfg.pdfinfo, [pdfPath], 30000));
  } catch (err) {
    const stderr = String(err.stderr || "");
    const e = new Error(
      /password/i.test(stderr)
        ? "This PDF is password-protected and cannot be processed."
        : "This file could not be read as a valid PDF.",
    );
    e.status = 400;
    throw e;
  }
  const pages = parsePageCount(stdout);
  if (pages < 1) {
    const e = new Error("The PDF has no readable pages.");
    e.status = 400;
    throw e;
  }
  return { pages };
};

const pageSizePts = async (pdfPath, page) => {
  const cfg = getLookbookConfig();
  try {
    const { stdout } = await run(
      cfg.pdfinfo,
      ["-f", String(page), "-l", String(page), pdfPath],
      30000,
    );
    return parsePageSize(stdout, page);
  } catch {
    return null;
  }
};

// ── image helpers ─────────────────────────────────────────────────────────
const fileExists = async (p) => {
  try {
    await fsp.access(p);
    return true;
  } catch {
    return false;
  }
};

const sha1File = (filePath) =>
  new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha1");
    fs.createReadStream(filePath)
      .on("error", reject)
      .on("data", (c) => hash.update(c))
      .on("end", () => resolve(hash.digest("hex")));
  });

// Writes full / display / thumb WebP variants. Output is written to a
// .partial file first and renamed, so an interrupted run never leaves a
// truncated image that a retry would mistake for a finished one.
const writeVariants = async (srcPath, outDir, baseName) => {
  const cfg = getLookbookConfig();
  const sharp = await loadSharp();
  await fsp.mkdir(outDir, { recursive: true });

  const plan = [
    ["full", cfg.fullMaxPx, cfg.webpQuality],
    ["display", cfg.displayMaxPx, Math.max(cfg.webpQuality - 3, 40)],
    ["thumb", cfg.thumbMaxPx, Math.max(cfg.webpQuality - 10, 40)],
  ];
  const files = {};
  let width = null;
  let height = null;

  for (const [variant, maxPx, quality] of plan) {
    const fileName = `${baseName}-${variant}.webp`;
    const finalPath = path.join(outDir, fileName);
    const partialPath = `${finalPath}.partial`;
    const info = await sharp(srcPath, { limitInputPixels: cfg.maxInputPixels })
      .flatten({ background: "#ffffff" })
      .resize({
        width: maxPx,
        height: maxPx,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality, effort: 4 })
      .toFile(partialPath);
    await fsp.rename(partialPath, finalPath);
    files[variant] = fileName;
    if (variant === "full") {
      width = info.width;
      height = info.height;
    }
  }
  return { files, width, height };
};

const variantsExist = async (outDir, baseName) => {
  for (const v of ["full", "display", "thumb"]) {
    if (!(await fileExists(path.join(outDir, `${baseName}-${v}.webp`)))) {
      return false;
    }
  }
  return true;
};

const nextStyleNumber = async () => {
  for (let i = 0; i < 20; i++) {
    const counter = await Counter.findOneAndUpdate(
      { _id: "lookbookStyle" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: false },
    );
    const code = `SW-${String(counter.seq).padStart(4, "0")}`;
    if (!(await Lookbook.exists({ styleNumber: code }))) return code;
  }
  return `SW-${Date.now()}`;
};

// Real design code printed on the page (e.g. S-761(A)), exactly as printed -
// several pages can legitimately share one code (different colours), so it is
// never altered. Otherwise the automatic SW-xxxx number. Same format rules as
// the admin editor (spaces become "-", upper case, max 40).
const pickStyleNumber = async (label) => {
  const code = label?.code
    ? label.code.toUpperCase().replace(/\s+/g, "-").slice(0, 40)
    : "";
  return code || nextStyleNumber();
};

const upsertItem = async ({
  catalogue,
  sourceKey,
  sourceType,
  pageNumber,
  title,
  sortOrder,
  isPublished,
  contentHash,
  variants,
  label = null,
  noCode = false,
}) => {
  const catalogueId = catalogue._id;
  const category =
    String(catalogue.collectionName || catalogue.title || "Catalogue").slice(
      0,
      80,
    ) || "Catalogue";
  const fileFields = {
    image: publicAssetPath(catalogueId, variants.files.display),
    display: publicAssetPath(catalogueId, variants.files.display),
    full: publicAssetPath(catalogueId, variants.files.full),
    thumb: publicAssetPath(catalogueId, variants.files.thumb),
    width: variants.width,
    height: variants.height,
  };

  const existing = await Lookbook.findOne({ sourceKey }).select("_id").lean();
  if (existing) {
    // Retry path: refresh file references only – keep admin edits intact.
    await Lookbook.updateOne({ _id: existing._id }, { $set: fileFields });
    return existing._id;
  }
  // Cover / closing pages carry no design code.
  const styleNumber = noCode ? "" : await pickStyleNumber(label);
  const doc = await Lookbook.create({
    ...fileFields,
    title,
    styleNumber,
    detailText: label?.details || "",
    category,
    catalogueId,
    sourceType,
    pageNumber,
    sourceKey,
    contentHash,
    sortOrder,
    isPublished,
  });
  return doc._id;
};

// ── per-page work ─────────────────────────────────────────────────────────
const renderPageToPng = async (pdfPath, page, workDir, cfg) => {
  const prefix = path.join(workDir, `page-${page}`);
  await run(
    cfg.pdftoppm,
    [
      "-png",
      "-singlefile",
      "-scale-to",
      String(cfg.fullMaxPx),
      "-f",
      String(page),
      "-l",
      String(page),
      pdfPath,
      prefix,
    ],
    cfg.toolTimeoutMs,
  );
  return `${prefix}.png`;
};

const listPageImages = async (pdfPath, page, cfg) => {
  const { stdout } = await run(
    cfg.pdfimages,
    ["-list", "-f", String(page), "-l", String(page), pdfPath],
    cfg.toolTimeoutMs,
  );
  return parseImageList(stdout);
};

const extractPageImages = async (pdfPath, page, workDir, cfg) => {
  const prefix = path.join(workDir, `img-${page}`);
  await run(
    cfg.pdfimages,
    ["-png", "-f", String(page), "-l", String(page), pdfPath, prefix],
    cfg.toolTimeoutMs,
  );
};

const touch = (id, set) =>
  LookbookCatalogue.updateOne({ _id: id }, { $set: set });

const processEmbedded = async ({
  catalogue,
  pdfPath,
  page,
  workDir,
  outDir,
  cfg,
  report,
}) => {
  if (cfg.maxEmbeddedPerPage === 0) return;
  const rows = await listPageImages(pdfPath, page, cfg);
  if (!rows.length) return;
  const size = await pageSizePts(pdfPath, page);

  const candidates = [];
  rows.forEach((row, index) => {
    if (row.type !== "image") return; // masks / stencils are not photos
    if (row.width < cfg.minEmbeddedPx || row.height < cfg.minEmbeddedPx) {
      report.embeddedSkippedSmall += 1;
      return;
    }
    // Full-page scan: the rendered page already IS this image.
    if (isFullPageImage(row, size)) {
      report.embeddedSkippedFullPage += 1;
      return;
    }
    candidates.push(index);
  });
  if (!candidates.length) return;

  await extractPageImages(pdfPath, page, workDir, cfg);

  let kept = 0;
  for (const index of candidates) {
    if (kept >= cfg.maxEmbeddedPerPage) break;
    const file = path.join(
      workDir,
      `img-${page}-${String(index).padStart(3, "0")}.png`,
    );
    if (!(await fileExists(file))) {
      report.embeddedSkippedFailed += 1;
      continue;
    }
    try {
      const hash = await sha1File(file);
      const sourceKey = `${catalogue._id}:img:${hash}`;
      const baseName = `img-${hash.slice(0, 16)}`;
      const existing = await Lookbook.exists({ sourceKey });
      if (existing && (await variantsExist(outDir, baseName))) {
        report.embeddedSkippedDuplicate += 1;
        continue;
      }
      const variants = await writeVariants(file, outDir, baseName);
      await upsertItem({
        catalogue,
        sourceKey,
        sourceType: "embedded",
        pageNumber: page,
        title: `${catalogue.title} – Page ${page} photo ${kept + 1}`,
        sortOrder: page * 100 + (kept + 1),
        isPublished: false, // admin opts embedded photos in after review
        contentHash: hash,
        variants,
      });
      report.embeddedExtracted += 1;
      kept += 1;
    } catch (err) {
      report.embeddedSkippedFailed += 1;
      console.error(
        `[lookbook-pdf] embedded image failed (catalogue ${catalogue._id}, page ${page}): ${err.message}`,
      );
    } finally {
      await fsp.rm(file, { force: true });
    }
  }
};

// ── main job ──────────────────────────────────────────────────────────────
export const processCatalogue = async (catalogueId) => {
  const id = String(catalogueId);
  const cfg = getLookbookConfig();
  let workDir = "";
  try {
    const catalogue = await LookbookCatalogue.findById(id);
    if (!catalogue || catalogue.status !== "processing") return;

    await assertToolsAvailable();
    const pdfPath = pdfPathFor(id);
    if (!(await fileExists(pdfPath))) {
      throw new Error(
        "The source PDF is no longer on the server. Please delete this catalogue and upload the PDF again.",
      );
    }

    const { pages } = await inspectPdf(pdfPath);
    if (pages > cfg.maxPages) {
      throw new Error(
        `PDF has ${pages} pages; the configured limit is ${cfg.maxPages}.`,
      );
    }

    await fsp.mkdir(WORK_ROOT, { recursive: true });
    workDir = await fsp.mkdtemp(path.join(WORK_ROOT, `${id}-`));
    const outDir = catalogueDirFor(id);
    await fsp.mkdir(outDir, { recursive: true });

    const done = new Set(catalogue.donePages || []);
    const report = {
      pagesRendered: catalogue.report?.pagesRendered || 0,
      embeddedExtracted: 0,
      embeddedSkippedSmall: 0,
      embeddedSkippedDuplicate: 0,
      embeddedSkippedFullPage: 0,
      embeddedSkippedFailed: 0,
    };
    const failedPages = [];
    const warnings = [];

    await touch(id, {
      totalPages: pages,
      stage: "Rendering pages",
      startedAt: catalogue.startedAt || new Date(),
      failedPages: [],
      error: "",
    });

    for (let page = 1; page <= pages; page++) {
      const pageKey = `${id}:p${page}:page`;
      const baseName = `p${String(page).padStart(4, "0")}`;

      try {
        const pageItemOk =
          done.has(page) &&
          (await Lookbook.exists({ sourceKey: pageKey })) &&
          (await variantsExist(outDir, baseName));

        if (!pageItemOk) {
          const png = await renderPageToPng(pdfPath, page, workDir, cfg);
          try {
            const variants = await writeVariants(png, outDir, baseName);
            // Only read the label for NEW items so admin edits survive retries.
            // First page (cover) and last page (thank-you) get no design code.
            const isEdgePage = page === 1 || page === pages;
            const label =
              isEdgePage || (await Lookbook.exists({ sourceKey: pageKey }))
                ? null
                : await readPageLabel({
                    cfg,
                    sharp: await loadSharp(),
                    pdfPath,
                    page,
                    pngPath: png,
                    workDir,
                  });
            await upsertItem({
              catalogue,
              sourceKey: pageKey,
              sourceType: "page",
              pageNumber: page,
              title: `${catalogue.title} – Page ${page}`,
              sortOrder: page * 100,
              isPublished: true,
              contentHash: "",
              variants,
              label,
              noCode: isEdgePage,
            });
          } finally {
            await fsp.rm(png, { force: true });
          }
          report.pagesRendered += 1;

          try {
            await processEmbedded({
              catalogue,
              pdfPath,
              page,
              workDir,
              outDir,
              cfg,
              report,
            });
          } catch (err) {
            warnings.push(
              `Page ${page}: embedded photo extraction failed (${err.message}). The full page image was kept.`,
            );
          }
        }

        done.add(page);
        await touch(id, {
          donePages: Array.from(done).sort((a, b) => a - b),
          stage: `Processed page ${page} of ${pages}`,
          "report.pagesRendered": report.pagesRendered,
        });
      } catch (err) {
        failedPages.push(page);
        console.error(
          `[lookbook-pdf] page ${page} failed (catalogue ${id}): ${err.message}`,
        );
      }
    }

    const finalDone = Array.from(done).sort((a, b) => a - b);
    const prevReport = catalogue.report?.toObject?.() || {};
    const mergedReport = {
      pagesRendered: finalDone.length,
      embeddedExtracted:
        (prevReport.embeddedExtracted || 0) + report.embeddedExtracted,
      embeddedSkippedSmall:
        (prevReport.embeddedSkippedSmall || 0) + report.embeddedSkippedSmall,
      embeddedSkippedDuplicate:
        (prevReport.embeddedSkippedDuplicate || 0) +
        report.embeddedSkippedDuplicate,
      embeddedSkippedFullPage:
        (prevReport.embeddedSkippedFullPage || 0) +
        report.embeddedSkippedFullPage,
      embeddedSkippedFailed:
        (prevReport.embeddedSkippedFailed || 0) + report.embeddedSkippedFailed,
    };

    if (failedPages.length) {
      await touch(id, {
        status: "failed",
        stage: "Needs retry",
        failedPages,
        report: mergedReport,
        warnings,
        finishedAt: new Date(),
        error: `${failedPages.length} page(s) could not be processed: ${failedPages
          .slice(0, 20)
          .join(
            ", ",
          )}${failedPages.length > 20 ? "…" : ""}. Retry to process only the missing pages.`,
      });
      return;
    }

    await touch(id, {
      status: "draft",
      stage: "Ready for review",
      failedPages: [],
      report: mergedReport,
      warnings,
      error: "",
      finishedAt: new Date(),
    });
    // Source PDF is only needed for retries – free the disk once everything worked.
    await fsp.rm(pdfPath, { force: true });
  } catch (err) {
    console.error(`[lookbook-pdf] catalogue ${id} failed: ${err.message}`);
    try {
      await LookbookCatalogue.updateOne(
        { _id: id },
        {
          $set: {
            status: "failed",
            stage: "Needs retry",
            error: String(err.message || "Processing failed").slice(0, 900),
            finishedAt: new Date(),
          },
        },
      );
    } catch (dbErr) {
      console.error(
        `[lookbook-pdf] could not record failure: ${dbErr.message}`,
      );
    }
  } finally {
    if (workDir) await fsp.rm(workDir, { recursive: true, force: true });
  }
};

// ── in-process queue (one catalogue at a time) ────────────────────────────
const queue = [];
const active = new Set();
let draining = false;

export const isCatalogueBusy = (id) =>
  active.has(String(id)) || queue.includes(String(id));

const drain = async () => {
  if (draining) return;
  draining = true;
  try {
    while (queue.length) {
      const id = queue.shift();
      active.add(id);
      try {
        await processCatalogue(id);
      } catch (err) {
        console.error(`[lookbook-pdf] worker error: ${err.message}`);
      } finally {
        active.delete(id);
      }
    }
  } finally {
    draining = false;
  }
};

export const enqueueCatalogue = (id) => {
  const key = String(id);
  if (isCatalogueBusy(key)) return;
  queue.push(key);
  // Detached on purpose: processCatalogue never rejects, drain catches the rest.
  drain().catch((err) =>
    console.error(`[lookbook-pdf] drain error: ${err.message}`),
  );
};

// After a crash / restart / nodemon reload the in-memory queue is lost and a
// catalogue would stay "processing" forever. Processing is idempotent, so
// re-queueing continues from the pages that are already done.
export const resumeInterruptedCatalogues = async () => {
  try {
    const stuck = await LookbookCatalogue.find({ status: "processing" })
      .select("_id")
      .lean();
    stuck.forEach((c) => enqueueCatalogue(c._id));
    if (stuck.length) {
      console.log(
        `[lookbook-pdf] resumed ${stuck.length} interrupted catalogue(s)`,
      );
    }
  } catch (err) {
    console.error(`[lookbook-pdf] resume failed: ${err.message}`);
  }
};

// ── cleanup ───────────────────────────────────────────────────────────────
export const removeCatalogueAssets = async (catalogueId) => {
  const dir = catalogueDirFor(catalogueId);
  await fsp.rm(dir, { recursive: true, force: true });
  await fsp.rm(pdfPathFor(catalogueId), { force: true });
};

