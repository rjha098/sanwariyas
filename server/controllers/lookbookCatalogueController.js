// // FILE: server/controllers/lookbookCatalogueController.js
// // PDF catalogue management (admin) + public catalogue-aware lookbook feed.
// import fs from "fs";
// import fsp from "fs/promises";
// import path from "path";
// import crypto from "crypto";
// import { fileTypeFromFile } from "file-type";
// import Lookbook from "../models/Lookbook.js";
// import LookbookCatalogue from "../models/LookbookCatalogue.js";
// import { getLookbookConfig } from "../utils/lookbookConfig.js";
// import {
//   PDF_STORE_ROOT,
//   assertToolsAvailable,
//   enqueueCatalogue,
//   inspectPdf,
//   isCatalogueBusy,
//   isObjectId,
//   pdfPathFor,
//   removeCatalogueAssets,
// } from "../services/lookbookPdfService.js";

// const str = (v, max) =>
//   String(v ?? "")
//     .replace(/[\u0000-\u001F\u007F]/g, " ")
//     .trim()
//     .slice(0, max);

// const fail = (res, status, message) =>
//   res.status(status).json({ success: false, message });

// const handleError = (res, error, fallback = "Something went wrong.") => {
//   if (error?.name === "CastError" || error?.name === "ValidationError") {
//     return fail(res, 400, error.message);
//   }
//   console.error(`[lookbook-catalogue] ${error?.name}: ${error?.message}`);
//   const status = Number.isInteger(error?.status) ? error.status : 500;
//   return fail(res, status, status === 500 ? fallback : error.message);
// };

// const removeTemp = async (file) => {
//   try {
//     if (file?.path) await fsp.rm(file.path, { force: true });
//   } catch {
//     /* best effort */
//   }
// };

// const sha256File = (filePath) =>
//   new Promise((resolve, reject) => {
//     const hash = crypto.createHash("sha256");
//     fs.createReadStream(filePath)
//       .on("error", reject)
//       .on("data", (c) => hash.update(c))
//       .on("end", () => resolve(hash.digest("hex")));
//   });

// const moveFile = async (from, to) => {
//   try {
//     await fsp.rename(from, to);
//   } catch (err) {
//     if (err.code !== "EXDEV") throw err;
//     await fsp.copyFile(from, to);
//     await fsp.rm(from, { force: true });
//   }
// };

// const normalizeStyle = (v) =>
//   String(v || "")
//     .trim()
//     .toUpperCase()
//     .replace(/\s+/g, "-")
//     .slice(0, 40);

// // A "processing" catalogue that no worker owns (server restarted mid-job)
// // is flipped to "failed" so the admin can retry instead of waiting forever.
// const reconcileStuck = async () => {
//   const stuck = await LookbookCatalogue.find({ status: "processing" })
//     .select("_id")
//     .lean();
//   const orphans = stuck.filter((c) => !isCatalogueBusy(c._id));
//   if (!orphans.length) return;
//   await LookbookCatalogue.updateMany(
//     { _id: { $in: orphans.map((c) => c._id) }, status: "processing" },
//     {
//       $set: {
//         status: "failed",
//         stage: "Needs retry",
//         error:
//           "Processing was interrupted (the server restarted). Retry to continue where it stopped.",
//       },
//     },
//   );
// };

// const itemCounts = async (ids) => {
//   if (!ids.length) return new Map();
//   const rows = await Lookbook.aggregate([
//     { $match: { catalogueId: { $in: ids } } },
//     {
//       $group: {
//         _id: "$catalogueId",
//         total: { $sum: 1 },
//         published: { $sum: { $cond: ["$isPublished", 1, 0] } },
//         pages: { $sum: { $cond: [{ $eq: ["$sourceType", "page"] }, 1, 0] } },
//         // published count must ignore hidden embedded photos
//         publishedPages: {
//           $sum: {
//             $cond: [
//               {
//                 $and: ["$isPublished", { $ne: ["$sourceType", "embedded"] }],
//               },
//               1,
//               0,
//             ],
//           },
//         },
//         embedded: {
//           $sum: { $cond: [{ $eq: ["$sourceType", "embedded"] }, 1, 0] },
//         },
//       },
//     },
//   ]);
//   return new Map(rows.map((r) => [String(r._id), r]));
// };

// const shapeCatalogue = (c, counts, cover) => {
//   const n = counts.get(String(c._id)) || {};
//   return {
//     _id: c._id,
//     title: c.title,
//     collectionName: c.collectionName,
//     season: c.season,
//     description: c.description,
//     status: c.status,
//     error: c.error,
//     stage: c.stage,
//     totalPages: c.totalPages,
//     donePages: (c.donePages || []).length,
//     failedPages: c.failedPages || [],
//     report: c.report,
//     warnings: c.warnings || [],
//     originalName: c.originalName,
//     pdfBytes: c.pdfBytes,
//     publishedAt: c.publishedAt,
//     createdAt: c.createdAt,
//     updatedAt: c.updatedAt,
//     counts: {
//       total: (n.total || 0) - (n.embedded || 0),
//       published: n.publishedPages || 0,
//       pages: n.pages || 0,
//       embedded: n.embedded || 0,
//     },
//     cover: cover || "",
//   };
// };

// const covers = async (ids) => {
//   if (!ids.length) return new Map();
//   const rows = await Lookbook.aggregate([
//     {
//       $match: {
//         catalogueId: { $in: ids },
//         thumb: { $ne: "" },
//         sourceType: { $ne: "embedded" },
//       },
//     },
//     { $sort: { sortOrder: 1 } },
//     {
//       $group: {
//         _id: "$catalogueId",
//         thumb: { $first: "$thumb" },
//         display: { $first: "$display" },
//       },
//     },
//   ]);
//   // Cover = page 1 in the larger "display" size so it stays sharp on the cards.
//   return new Map(rows.map((r) => [String(r._id), r.display || r.thumb]));
// };

// const publicItem = (d, catalogueTitle = "") => ({
//   _id: d._id,
//   title: d.title,
//   styleNumber: d.styleNumber,
//   category: d.category,
//   badge: d.badge,
//   isFeatured: d.isFeatured,
//   image: d.image,
//   thumb: d.thumb || d.image,
//   display: d.display || d.image,
//   full: d.full || d.image,
//   width: d.width || null,
//   height: d.height || null,
//   catalogueId: d.catalogueId || null,
//   catalogueTitle: d.catalogueId ? catalogueTitle : "",
//   sourceType: d.sourceType || "legacy",
//   pageNumber: d.pageNumber || null,
// });

// // ───────────────────────── PUBLIC ─────────────────────────

// export const getLookbookPublicConfig = (req, res) => {
//   const cfg = getLookbookConfig();
//   res.json({
//     success: true,
//     whatsappNumber: cfg.whatsappNumber || null,
//     maxSelection: 40,
//   });
// };

// export const getPublishedCatalogues = async (req, res) => {
//   try {
//     const list = await LookbookCatalogue.find({ status: "published" })
//       .sort({ publishedAt: -1, _id: -1 })
//       .lean();
//     const ids = list.map((c) => c._id);
//     const [counts, coverMap] = await Promise.all([
//       itemCounts(ids),
//       covers(ids),
//     ]);
//     res.json({
//       success: true,
//       catalogues: list.map((c) => {
//         const shaped = shapeCatalogue(c, counts, coverMap.get(String(c._id)));
//         return {
//           _id: shaped._id,
//           title: shaped.title,
//           collectionName: shaped.collectionName,
//           season: shaped.season,
//           description: shaped.description,
//           cover: shaped.cover,
//           count: shaped.counts.published,
//         };
//       }),
//     });
//   } catch (error) {
//     handleError(res, error);
//   }
// };

// // Replaces the old GET /api/lookbook handler (same response shape).
// //   default            → legacy single photos only (what the old admin list expects)
// //   ?scope=all         → legacy photos + items of PUBLISHED catalogues
// //   ?catalogue=<id>    → only that published catalogue
// export const getPublicLookbook = async (req, res) => {
//   try {
//     const page = Math.max(parseInt(req.query.page) || 1, 1);
//     const limit = Math.min(Math.max(parseInt(req.query.limit) || 24, 1), 60);
//     const skip = (page - 1) * limit;

//     let filter = { catalogueId: null };
//     let sort = { isFeatured: -1, createdAt: -1, _id: -1 };
//     const titleById = new Map();

//     const wantsCatalogues =
//       req.query.scope === "all" || req.query.catalogue !== undefined;
//     if (wantsCatalogues) {
//       const catFilter = { status: "published" };
//       if (req.query.catalogue !== undefined) {
//         if (!isObjectId(String(req.query.catalogue))) {
//           return fail(res, 400, "Invalid catalogue id.");
//         }
//         catFilter._id = req.query.catalogue;
//       }
//       const published = await LookbookCatalogue.find(catFilter)
//         .select("_id title")
//         .lean();
//       published.forEach((c) => titleById.set(String(c._id), c.title));
//       const ids = published.map((c) => c._id);
//       const catalogueClause = {
//         catalogueId: { $in: ids },
//         isPublished: true,
//         sourceType: { $ne: "embedded" },
//       };
//       filter =
//         req.query.catalogue !== undefined
//           ? catalogueClause
//           : { $or: [{ catalogueId: null }, catalogueClause] };
//       // One catalogue = exact PDF page order (no featured re-ordering).
//       sort =
//         req.query.catalogue !== undefined
//           ? { sortOrder: 1, _id: 1 }
//           : {
//               isFeatured: -1,
//               catalogueId: -1,
//               sortOrder: 1,
//               createdAt: -1,
//               _id: -1,
//             };
//     }

//     const [docs, total] = await Promise.all([
//       Lookbook.find(filter).sort(sort).skip(skip).limit(limit).lean(),
//       Lookbook.countDocuments(filter),
//     ]);

//     res.json({
//       success: true,
//       items: docs.map((d) =>
//         wantsCatalogues
//           ? publicItem(d, titleById.get(String(d.catalogueId)))
//           : d,
//       ),
//       pagination: { total, page, limit, pages: Math.ceil(total / limit) },
//     });
//   } catch (error) {
//     handleError(res, error);
//   }
// };

// // ───────────────────────── ADMIN ─────────────────────────

// export const listCatalogues = async (req, res) => {
//   try {
//     await reconcileStuck();
//     const list = await LookbookCatalogue.find().sort({ createdAt: -1 }).lean();
//     const ids = list.map((c) => c._id);
//     const [counts, coverMap] = await Promise.all([
//       itemCounts(ids),
//       covers(ids),
//     ]);
//     const cfg = getLookbookConfig();
//     res.json({
//       success: true,
//       catalogues: list.map((c) =>
//         shapeCatalogue(c, counts, coverMap.get(String(c._id))),
//       ),
//       limits: {
//         maxPdfMb: Math.round(cfg.maxPdfBytes / 1024 / 1024),
//         maxPages: cfg.maxPages,
//         maxCatalogues: cfg.maxCatalogues,
//       },
//       whatsappConfigured: !!cfg.whatsappNumber,
//     });
//   } catch (error) {
//     handleError(res, error);
//   }
// };

// export const getCatalogue = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!isObjectId(id)) return fail(res, 400, "Invalid catalogue id.");
//     await reconcileStuck();
//     const c = await LookbookCatalogue.findById(id).lean();
//     if (!c) return fail(res, 404, "Catalogue not found.");

//     // Only real PDF pages are listed; previously extracted embedded photos stay hidden.
//     const filter = { catalogueId: c._id, sourceType: { $ne: "embedded" } };
//     const [items, counts, coverMap] = await Promise.all([
//       Lookbook.find(filter).sort({ sortOrder: 1, _id: 1 }).limit(1500).lean(),
//       itemCounts([c._id]),
//       covers([c._id]),
//     ]);
//     res.json({
//       success: true,
//       catalogue: shapeCatalogue(c, counts, coverMap.get(String(c._id))),
//       items: items.map((d) => ({
//         ...publicItem(d, c.title),
//         isPublished: d.isPublished,
//         sortOrder: d.sortOrder,
//       })),
//     });
//   } catch (error) {
//     handleError(res, error);
//   }
// };

// export const createCatalogue = async (req, res) => {
//   const file = req.file;
//   let storedPdf = "";
//   try {
//     if (!file) return fail(res, 400, "Please choose a PDF file to upload.");

//     // 0. Catalogue cap (archived ones do not count).
//     const { maxCatalogues } = getLookbookConfig();
//     const activeCount = await LookbookCatalogue.countDocuments({
//       status: { $ne: "archived" },
//     });
//     if (activeCount >= maxCatalogues) {
//       await removeTemp(file);
//       return fail(
//         res,
//         409,
//         `You already have ${activeCount} catalogues (maximum ${maxCatalogues}). Archive or delete one before uploading another.`,
//       );
//     }

//     // 1. Real content check – extension/MIME alone are not trusted.
//     const type = await fileTypeFromFile(file.path);
//     const header = Buffer.alloc(5);
//     const fh = await fsp.open(file.path, "r");
//     try {
//       await fh.read(header, 0, 5, 0);
//     } finally {
//       await fh.close();
//     }
//     if (type?.mime !== "application/pdf" || header.toString() !== "%PDF-") {
//       await removeTemp(file);
//       return fail(res, 400, "The uploaded file is not a valid PDF.");
//     }

//     // 2. Host capability + page-count limits BEFORE anything is stored.
//     await assertToolsAvailable();
//     const cfg = getLookbookConfig();
//     const { pages } = await inspectPdf(file.path);
//     if (pages > cfg.maxPages) {
//       await removeTemp(file);
//       return fail(
//         res,
//         400,
//         `This PDF has ${pages} pages. The maximum allowed is ${cfg.maxPages}.`,
//       );
//     }

//     // 3. Duplicate protection.
//     const pdfHash = await sha256File(file.path);
//     const dup = await LookbookCatalogue.findOne({
//       pdfHash,
//       status: { $ne: "archived" },
//     })
//       .select("title status")
//       .lean();
//     if (dup) {
//       await removeTemp(file);
//       return fail(
//         res,
//         409,
//         `This PDF was already uploaded as "${dup.title}" (${dup.status}). Open that catalogue${dup.status === "failed" ? " and use Retry" : ""} instead of uploading it again.`,
//       );
//     }

//     const originalName = str(path.basename(file.originalname || ""), 200);
//     const title =
//       str(req.body.title, 150) ||
//       str(originalName.replace(/\.pdf$/i, ""), 150) ||
//       "Untitled catalogue";

//     const catalogue = new LookbookCatalogue({
//       title,
//       collectionName: str(req.body.collectionName, 80),
//       season: str(req.body.season, 60),
//       description: str(req.body.description, 1000),
//       status: "processing",
//       stage: "Queued",
//       pdfHash,
//       pdfFile: "pending",
//       originalName,
//       pdfBytes: file.size,
//       totalPages: pages,
//       startedAt: new Date(),
//     });

//     await fsp.mkdir(PDF_STORE_ROOT, { recursive: true });
//     storedPdf = pdfPathFor(catalogue._id);
//     await moveFile(file.path, storedPdf);
//     catalogue.pdfFile = `${catalogue._id}.pdf`;
//     await catalogue.save();

//     enqueueCatalogue(catalogue._id);

//     // 202: the PDF is validated and stored; images are NOT ready yet.
//     res.status(202).json({
//       success: true,
//       message:
//         "PDF accepted and queued for processing. It will be reviewable once the status shows Ready.",
//       catalogue: {
//         _id: catalogue._id,
//         title: catalogue.title,
//         status: catalogue.status,
//         totalPages: pages,
//       },
//     });
//   } catch (error) {
//     await removeTemp(file);
//     if (storedPdf) await fsp.rm(storedPdf, { force: true }).catch(() => {});
//     handleError(res, error, "Could not process the uploaded PDF.");
//   }
// };

// export const retryCatalogue = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!isObjectId(id)) return fail(res, 400, "Invalid catalogue id.");
//     if (isCatalogueBusy(id)) {
//       return fail(res, 409, "This catalogue is already being processed.");
//     }
//     // Atomic claim so two clicks can never start two workers.
//     const claimed = await LookbookCatalogue.findOneAndUpdate(
//       { _id: id, status: "failed" },
//       {
//         $set: { status: "processing", stage: "Queued", error: "" },
//       },
//       { new: true },
//     );
//     if (!claimed) {
//       return fail(res, 409, "Only failed catalogues can be retried.");
//     }
//     enqueueCatalogue(id);
//     res.status(202).json({
//       success: true,
//       message: "Retry started. Only missing pages will be processed.",
//     });
//   } catch (error) {
//     handleError(res, error);
//   }
// };

// export const updateCatalogue = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!isObjectId(id)) return fail(res, 400, "Invalid catalogue id.");
//     const c = await LookbookCatalogue.findById(id);
//     if (!c) return fail(res, 404, "Catalogue not found.");
//     const b = req.body || {};

//     if (b.title !== undefined) {
//       const t = str(b.title, 150);
//       if (!t) return fail(res, 400, "Title cannot be empty.");
//       c.title = t;
//     }
//     if (b.collectionName !== undefined)
//       c.collectionName = str(b.collectionName, 80);
//     if (b.season !== undefined) c.season = str(b.season, 60);
//     if (b.description !== undefined) c.description = str(b.description, 1000);

//     if (b.status !== undefined) {
//       if (!["draft", "published", "archived"].includes(b.status)) {
//         return fail(res, 400, "Invalid status.");
//       }
//       if (["processing", "failed"].includes(c.status)) {
//         return fail(
//           res,
//           409,
//           "Finish processing (or retry) before changing the publication status.",
//         );
//       }
//       if (b.status === "published") {
//         const n = await Lookbook.countDocuments({
//           catalogueId: c._id,
//           isPublished: true,
//           sourceType: { $ne: "embedded" },
//         });
//         if (!n) {
//           return fail(
//             res,
//             400,
//             "Publish at least one image before publishing the catalogue.",
//           );
//         }
//         if (c.status !== "published") c.publishedAt = new Date();
//       }
//       c.status = b.status;
//     }

//     await c.save();

//     const category = c.collectionName || c.title;
//     await Lookbook.updateMany(
//       { catalogueId: c._id },
//       { $set: { category: category.slice(0, 80) } },
//     );
//     res.json({ success: true, message: "Catalogue updated." });
//   } catch (error) {
//     handleError(res, error);
//   }
// };

// export const deleteCatalogue = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!isObjectId(id)) return fail(res, 400, "Invalid catalogue id.");
//     if (isCatalogueBusy(id)) {
//       return fail(
//         res,
//         409,
//         "This catalogue is being processed. Wait until it finishes, then delete it.",
//       );
//     }
//     const c = await LookbookCatalogue.findById(id).select("_id").lean();
//     if (!c) return fail(res, 404, "Catalogue not found.");

//     // DB first, then files: a failure can never leave records pointing at
//     // missing images (orphaned files are harmless and removed best-effort).
//     await Lookbook.deleteMany({ catalogueId: c._id });
//     await LookbookCatalogue.deleteOne({ _id: c._id });
//     try {
//       await removeCatalogueAssets(c._id);
//     } catch (err) {
//       console.error(`[lookbook-catalogue] asset cleanup: ${err.message}`);
//     }
//     res.json({ success: true, message: "Catalogue and its images deleted." });
//   } catch (error) {
//     handleError(res, error);
//   }
// };

// export const updateCatalogueItem = async (req, res) => {
//   try {
//     const { id, itemId } = req.params;
//     if (!isObjectId(id) || !isObjectId(itemId)) {
//       return fail(res, 400, "Invalid id.");
//     }
//     const item = await Lookbook.findOne({ _id: itemId, catalogueId: id });
//     if (!item) return fail(res, 404, "Image not found in this catalogue.");
//     const b = req.body || {};

//     if (b.title !== undefined) {
//       const t = str(b.title, 150);
//       if (!t) return fail(res, 400, "Title cannot be empty.");
//       item.title = t;
//     }
//     if (b.styleNumber !== undefined) {
//       const next = normalizeStyle(b.styleNumber);
//       if (!next) return fail(res, 400, "Design code cannot be empty.");
//       if (
//         next !== item.styleNumber &&
//         (await Lookbook.exists({ styleNumber: next, _id: { $ne: item._id } }))
//       ) {
//         return fail(res, 400, `Design code ${next} is already in use.`);
//       }
//       item.styleNumber = next;
//     }
//     if (b.isPublished !== undefined) item.isPublished = b.isPublished === true;
//     await item.save();
//     res.json({ success: true, message: "Image updated." });
//   } catch (error) {
//     handleError(res, error);
//   }
// };

// export const setItemsPublished = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!isObjectId(id)) return fail(res, 400, "Invalid catalogue id.");
//     const b = req.body || {};
//     if (typeof b.isPublished !== "boolean") {
//       return fail(res, 400, "isPublished must be true or false.");
//     }
//     const filter = { catalogueId: id };
//     if (Array.isArray(b.ids)) {
//       if (!b.ids.length || b.ids.length > 2000 || !b.ids.every(isObjectId)) {
//         return fail(res, 400, "Provide 1–2000 valid image ids.");
//       }
//       filter._id = { $in: b.ids };
//     } else if (["page", "embedded"].includes(b.sourceType)) {
//       filter.sourceType = b.sourceType;
//     } else if (b.sourceType !== "all") {
//       return fail(res, 400, "Provide ids or a sourceType (page|embedded|all).");
//     }
//     const r = await Lookbook.updateMany(filter, {
//       $set: { isPublished: b.isPublished },
//     });
//     res.json({
//       success: true,
//       modified: r.modifiedCount,
//       message: `${r.modifiedCount} image(s) ${b.isPublished ? "published" : "hidden"}.`,
//     });
//   } catch (error) {
//     handleError(res, error);
//   }
// };

// export const reorderCatalogueItems = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!isObjectId(id)) return fail(res, 400, "Invalid catalogue id.");
//     const ids = req.body?.ids;
//     if (
//       !Array.isArray(ids) ||
//       !ids.length ||
//       ids.length > 2000 ||
//       !ids.every(isObjectId) ||
//       new Set(ids).size !== ids.length
//     ) {
//       return fail(res, 400, "Provide a unique list of valid image ids.");
//     }
//     const owned = await Lookbook.countDocuments({
//       catalogueId: id,
//       _id: { $in: ids },
//     });
//     if (owned !== ids.length) {
//       return fail(res, 400, "Some images do not belong to this catalogue.");
//     }
//     await Lookbook.bulkWrite(
//       ids.map((itemId, index) => ({
//         updateOne: {
//           filter: { _id: itemId, catalogueId: id },
//           update: { $set: { sortOrder: (index + 1) * 10 } },
//         },
//       })),
//     );
//     res.json({ success: true, message: "Order saved." });
//   } catch (error) {
//     handleError(res, error);
//   }
// };

// // Legacy item routes must never touch catalogue-generated images: their
// // variants/cleanup are managed through the catalogue endpoints above.
// export const guardCatalogueItems = async (req, res, next) => {
//   try {
//     const raw = req.params.id ? [req.params.id] : req.body?.ids;
//     const ids = (Array.isArray(raw) ? raw : []).filter(isObjectId);
//     if (
//       ids.length &&
//       (await Lookbook.exists({ _id: { $in: ids }, catalogueId: { $ne: null } }))
//     ) {
//       return fail(
//         res,
//         400,
//         "This image belongs to a PDF catalogue. Manage it from the Catalogues section.",
//       );
//     }
//     return next();
//   } catch (error) {
//     return handleError(res, error);
//   }
// };



// FILE: server/controllers/lookbookCatalogueController.js
// PDF catalogue management (admin) + public catalogue-aware lookbook feed.
import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import crypto from "crypto";
import { fileTypeFromFile } from "file-type";
import Lookbook from "../models/Lookbook.js";
import LookbookCatalogue from "../models/LookbookCatalogue.js";
import { getLookbookConfig } from "../utils/lookbookConfig.js";
import {
  PDF_STORE_ROOT,
  assertToolsAvailable,
  enqueueCatalogue,
  inspectPdf,
  isCatalogueBusy,
  isObjectId,
  pdfPathFor,
  removeCatalogueAssets,
} from "../services/lookbookPdfService.js";

const str = (v, max) =>
  String(v ?? "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .trim()
    .slice(0, max);

const fail = (res, status, message) =>
  res.status(status).json({ success: false, message });

const handleError = (res, error, fallback = "Something went wrong.") => {
  if (error?.name === "CastError" || error?.name === "ValidationError") {
    return fail(res, 400, error.message);
  }
  console.error(`[lookbook-catalogue] ${error?.name}: ${error?.message}`);
  const status = Number.isInteger(error?.status) ? error.status : 500;
  return fail(res, status, status === 500 ? fallback : error.message);
};

const removeTemp = async (file) => {
  try {
    if (file?.path) await fsp.rm(file.path, { force: true });
  } catch {
    /* best effort */
  }
};

const sha256File = (filePath) =>
  new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    fs.createReadStream(filePath)
      .on("error", reject)
      .on("data", (c) => hash.update(c))
      .on("end", () => resolve(hash.digest("hex")));
  });

const moveFile = async (from, to) => {
  try {
    await fsp.rename(from, to);
  } catch (err) {
    if (err.code !== "EXDEV") throw err;
    await fsp.copyFile(from, to);
    await fsp.rm(from, { force: true });
  }
};

const normalizeStyle = (v) =>
  String(v || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "-")
    .slice(0, 40);

// A "processing" catalogue that no worker owns (server restarted mid-job)
// is flipped to "failed" so the admin can retry instead of waiting forever.
const reconcileStuck = async () => {
  const stuck = await LookbookCatalogue.find({ status: "processing" })
    .select("_id")
    .lean();
  const orphans = stuck.filter((c) => !isCatalogueBusy(c._id));
  if (!orphans.length) return;
  await LookbookCatalogue.updateMany(
    { _id: { $in: orphans.map((c) => c._id) }, status: "processing" },
    {
      $set: {
        status: "failed",
        stage: "Needs retry",
        error:
          "Processing was interrupted (the server restarted). Retry to continue where it stopped.",
      },
    },
  );
};

const itemCounts = async (ids) => {
  if (!ids.length) return new Map();
  const rows = await Lookbook.aggregate([
    { $match: { catalogueId: { $in: ids } } },
    {
      $group: {
        _id: "$catalogueId",
        total: { $sum: 1 },
        published: { $sum: { $cond: ["$isPublished", 1, 0] } },
        pages: { $sum: { $cond: [{ $eq: ["$sourceType", "page"] }, 1, 0] } },
        // published count must ignore hidden embedded photos
        publishedPages: {
          $sum: {
            $cond: [
              {
                $and: [
                  "$isPublished",
                  { $ne: ["$sourceType", "embedded"] },
                ],
              },
              1,
              0,
            ],
          },
        },
        embedded: {
          $sum: { $cond: [{ $eq: ["$sourceType", "embedded"] }, 1, 0] },
        },
      },
    },
  ]);
  return new Map(rows.map((r) => [String(r._id), r]));
};

const shapeCatalogue = (c, counts, cover) => {
  const n = counts.get(String(c._id)) || {};
  return {
    _id: c._id,
    title: c.title,
    collectionName: c.collectionName,
    season: c.season,
    description: c.description,
    status: c.status,
    error: c.error,
    stage: c.stage,
    totalPages: c.totalPages,
    donePages: (c.donePages || []).length,
    failedPages: c.failedPages || [],
    report: c.report,
    warnings: c.warnings || [],
    originalName: c.originalName,
    pdfBytes: c.pdfBytes,
    publishedAt: c.publishedAt,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    counts: {
      total: (n.total || 0) - (n.embedded || 0),
      published: n.publishedPages || 0,
      pages: n.pages || 0,
      embedded: n.embedded || 0,
    },
    cover: cover || "",
  };
};

const covers = async (ids) => {
  if (!ids.length) return new Map();
  const rows = await Lookbook.aggregate([
    {
      $match: {
        catalogueId: { $in: ids },
        thumb: { $ne: "" },
        sourceType: { $ne: "embedded" },
      },
    },
    { $sort: { sortOrder: 1 } },
    {
      $group: {
        _id: "$catalogueId",
        thumb: { $first: "$thumb" },
        display: { $first: "$display" },
      },
    },
  ]);
  // Cover = page 1 in the larger "display" size so it stays sharp on the cards.
  return new Map(rows.map((r) => [String(r._id), r.display || r.thumb]));
};

const publicItem = (d, catalogueTitle = "") => ({
  _id: d._id,
  title: d.title,
  styleNumber: d.styleNumber,
  detailText: d.detailText || "",
  category: d.category,
  badge: d.badge,
  isFeatured: d.isFeatured,
  image: d.image,
  thumb: d.thumb || d.image,
  display: d.display || d.image,
  full: d.full || d.image,
  width: d.width || null,
  height: d.height || null,
  catalogueId: d.catalogueId || null,
  catalogueTitle: d.catalogueId ? catalogueTitle : "",
  sourceType: d.sourceType || "legacy",
  pageNumber: d.pageNumber || null,
});

// ───────────────────────── PUBLIC ─────────────────────────

export const getLookbookPublicConfig = (req, res) => {
  const cfg = getLookbookConfig();
  res.json({
    success: true,
    whatsappNumber: cfg.whatsappNumber || null,
    maxSelection: 40,
  });
};

export const getPublishedCatalogues = async (req, res) => {
  try {
    const list = await LookbookCatalogue.find({ status: "published" })
      .sort({ publishedAt: -1, _id: -1 })
      .lean();
    const ids = list.map((c) => c._id);
    const [counts, coverMap] = await Promise.all([
      itemCounts(ids),
      covers(ids),
    ]);
    res.json({
      success: true,
      catalogues: list.map((c) => {
        const shaped = shapeCatalogue(c, counts, coverMap.get(String(c._id)));
        return {
          _id: shaped._id,
          title: shaped.title,
          collectionName: shaped.collectionName,
          season: shaped.season,
          description: shaped.description,
          cover: shaped.cover,
          count: shaped.counts.published,
        };
      }),
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Replaces the old GET /api/lookbook handler (same response shape).
//   default            → legacy single photos only (what the old admin list expects)
//   ?scope=all         → legacy photos + items of PUBLISHED catalogues
//   ?catalogue=<id>    → only that published catalogue
export const getPublicLookbook = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 24, 1), 60);
    const skip = (page - 1) * limit;

    let filter = { catalogueId: null };
    let sort = { isFeatured: -1, createdAt: -1, _id: -1 };
    const titleById = new Map();

    const wantsCatalogues =
      req.query.scope === "all" || req.query.catalogue !== undefined;
    if (wantsCatalogues) {
      const catFilter = { status: "published" };
      if (req.query.catalogue !== undefined) {
        if (!isObjectId(String(req.query.catalogue))) {
          return fail(res, 400, "Invalid catalogue id.");
        }
        catFilter._id = req.query.catalogue;
      }
      const published = await LookbookCatalogue.find(catFilter)
        .select("_id title")
        .lean();
      published.forEach((c) => titleById.set(String(c._id), c.title));
      const ids = published.map((c) => c._id);
      const catalogueClause = {
        catalogueId: { $in: ids },
        isPublished: true,
        sourceType: { $ne: "embedded" },
      };
      filter =
        req.query.catalogue !== undefined
          ? catalogueClause
          : { $or: [{ catalogueId: null }, catalogueClause] };
      // One catalogue = exact PDF page order (no featured re-ordering).
      sort =
        req.query.catalogue !== undefined
          ? { sortOrder: 1, _id: 1 }
          : {
              isFeatured: -1,
              catalogueId: -1,
              sortOrder: 1,
              createdAt: -1,
              _id: -1,
            };
    }

    const [docs, total] = await Promise.all([
      Lookbook.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Lookbook.countDocuments(filter),
    ]);

    res.json({
      success: true,
      items: docs.map((d) =>
        wantsCatalogues
          ? publicItem(d, titleById.get(String(d.catalogueId)))
          : d,
      ),
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    handleError(res, error);
  }
};

// ───────────────────────── ADMIN ─────────────────────────

export const listCatalogues = async (req, res) => {
  try {
    await reconcileStuck();
    const list = await LookbookCatalogue.find().sort({ createdAt: -1 }).lean();
    const ids = list.map((c) => c._id);
    const [counts, coverMap] = await Promise.all([
      itemCounts(ids),
      covers(ids),
    ]);
    const cfg = getLookbookConfig();
    res.json({
      success: true,
      catalogues: list.map((c) =>
        shapeCatalogue(c, counts, coverMap.get(String(c._id))),
      ),
      limits: {
        maxPdfMb: Math.round(cfg.maxPdfBytes / 1024 / 1024),
        maxPages: cfg.maxPages,
        maxCatalogues: cfg.maxCatalogues,
      },
      whatsappConfigured: !!cfg.whatsappNumber,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const getCatalogue = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return fail(res, 400, "Invalid catalogue id.");
    await reconcileStuck();
    const c = await LookbookCatalogue.findById(id).lean();
    if (!c) return fail(res, 404, "Catalogue not found.");

    // Only real PDF pages are listed; previously extracted embedded photos stay hidden.
    const filter = { catalogueId: c._id, sourceType: { $ne: "embedded" } };
    const [items, counts, coverMap] = await Promise.all([
      Lookbook.find(filter).sort({ sortOrder: 1, _id: 1 }).limit(1500).lean(),
      itemCounts([c._id]),
      covers([c._id]),
    ]);
    res.json({
      success: true,
      catalogue: shapeCatalogue(c, counts, coverMap.get(String(c._id))),
      items: items.map((d) => ({
        ...publicItem(d, c.title),
        isPublished: d.isPublished,
        sortOrder: d.sortOrder,
      })),
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const createCatalogue = async (req, res) => {
  const file = req.file;
  let storedPdf = "";
  try {
    if (!file) return fail(res, 400, "Please choose a PDF file to upload.");

    // 0. Catalogue cap (archived ones do not count).
    const { maxCatalogues } = getLookbookConfig();
    const activeCount = await LookbookCatalogue.countDocuments({
      status: { $ne: "archived" },
    });
    if (activeCount >= maxCatalogues) {
      await removeTemp(file);
      return fail(
        res,
        409,
        `You already have ${activeCount} catalogues (maximum ${maxCatalogues}). Archive or delete one before uploading another.`,
      );
    }

    // 1. Real content check – extension/MIME alone are not trusted.
    const type = await fileTypeFromFile(file.path);
    const header = Buffer.alloc(5);
    const fh = await fsp.open(file.path, "r");
    try {
      await fh.read(header, 0, 5, 0);
    } finally {
      await fh.close();
    }
    if (type?.mime !== "application/pdf" || header.toString() !== "%PDF-") {
      await removeTemp(file);
      return fail(res, 400, "The uploaded file is not a valid PDF.");
    }

    // 2. Host capability + page-count limits BEFORE anything is stored.
    await assertToolsAvailable();
    const cfg = getLookbookConfig();
    const { pages } = await inspectPdf(file.path);
    if (pages > cfg.maxPages) {
      await removeTemp(file);
      return fail(
        res,
        400,
        `This PDF has ${pages} pages. The maximum allowed is ${cfg.maxPages}.`,
      );
    }

    // 3. Duplicate protection.
    const pdfHash = await sha256File(file.path);
    const dup = await LookbookCatalogue.findOne({
      pdfHash,
      status: { $ne: "archived" },
    })
      .select("title status")
      .lean();
    if (dup) {
      await removeTemp(file);
      return fail(
        res,
        409,
        `This PDF was already uploaded as "${dup.title}" (${dup.status}). Open that catalogue${dup.status === "failed" ? " and use Retry" : ""} instead of uploading it again.`,
      );
    }

    const originalName = str(path.basename(file.originalname || ""), 200);
    const title =
      str(req.body.title, 150) ||
      str(originalName.replace(/\.pdf$/i, ""), 150) ||
      "Untitled catalogue";

    const catalogue = new LookbookCatalogue({
      title,
      collectionName: str(req.body.collectionName, 80),
      season: str(req.body.season, 60),
      description: str(req.body.description, 1000),
      status: "processing",
      stage: "Queued",
      pdfHash,
      pdfFile: "pending",
      originalName,
      pdfBytes: file.size,
      totalPages: pages,
      startedAt: new Date(),
    });

    await fsp.mkdir(PDF_STORE_ROOT, { recursive: true });
    storedPdf = pdfPathFor(catalogue._id);
    await moveFile(file.path, storedPdf);
    catalogue.pdfFile = `${catalogue._id}.pdf`;
    await catalogue.save();

    enqueueCatalogue(catalogue._id);

    // 202: the PDF is validated and stored; images are NOT ready yet.
    res.status(202).json({
      success: true,
      message:
        "PDF accepted and queued for processing. It will be reviewable once the status shows Ready.",
      catalogue: {
        _id: catalogue._id,
        title: catalogue.title,
        status: catalogue.status,
        totalPages: pages,
      },
    });
  } catch (error) {
    await removeTemp(file);
    if (storedPdf) await fsp.rm(storedPdf, { force: true }).catch(() => {});
    handleError(res, error, "Could not process the uploaded PDF.");
  }
};

export const retryCatalogue = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return fail(res, 400, "Invalid catalogue id.");
    if (isCatalogueBusy(id)) {
      return fail(res, 409, "This catalogue is already being processed.");
    }
    // Atomic claim so two clicks can never start two workers.
    const claimed = await LookbookCatalogue.findOneAndUpdate(
      { _id: id, status: "failed" },
      {
        $set: { status: "processing", stage: "Queued", error: "" },
      },
      { new: true },
    );
    if (!claimed) {
      return fail(res, 409, "Only failed catalogues can be retried.");
    }
    enqueueCatalogue(id);
    res.status(202).json({
      success: true,
      message: "Retry started. Only missing pages will be processed.",
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const updateCatalogue = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return fail(res, 400, "Invalid catalogue id.");
    const c = await LookbookCatalogue.findById(id);
    if (!c) return fail(res, 404, "Catalogue not found.");
    const b = req.body || {};

    if (b.title !== undefined) {
      const t = str(b.title, 150);
      if (!t) return fail(res, 400, "Title cannot be empty.");
      c.title = t;
    }
    if (b.collectionName !== undefined)
      c.collectionName = str(b.collectionName, 80);
    if (b.season !== undefined) c.season = str(b.season, 60);
    if (b.description !== undefined)
      c.description = str(b.description, 1000);

    if (b.status !== undefined) {
      if (!["draft", "published", "archived"].includes(b.status)) {
        return fail(res, 400, "Invalid status.");
      }
      if (["processing", "failed"].includes(c.status)) {
        return fail(
          res,
          409,
          "Finish processing (or retry) before changing the publication status.",
        );
      }
      if (b.status === "published") {
        const n = await Lookbook.countDocuments({
          catalogueId: c._id,
          isPublished: true,
          sourceType: { $ne: "embedded" },
        });
        if (!n) {
          return fail(
            res,
            400,
            "Publish at least one image before publishing the catalogue.",
          );
        }
        if (c.status !== "published") c.publishedAt = new Date();
      }
      c.status = b.status;
    }

    await c.save();

    const category = c.collectionName || c.title;
    await Lookbook.updateMany(
      { catalogueId: c._id },
      { $set: { category: category.slice(0, 80) } },
    );
    res.json({ success: true, message: "Catalogue updated." });
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteCatalogue = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return fail(res, 400, "Invalid catalogue id.");
    if (isCatalogueBusy(id)) {
      return fail(
        res,
        409,
        "This catalogue is being processed. Wait until it finishes, then delete it.",
      );
    }
    const c = await LookbookCatalogue.findById(id).select("_id").lean();
    if (!c) return fail(res, 404, "Catalogue not found.");

    // DB first, then files: a failure can never leave records pointing at
    // missing images (orphaned files are harmless and removed best-effort).
    await Lookbook.deleteMany({ catalogueId: c._id });
    await LookbookCatalogue.deleteOne({ _id: c._id });
    try {
      await removeCatalogueAssets(c._id);
    } catch (err) {
      console.error(`[lookbook-catalogue] asset cleanup: ${err.message}`);
    }
    res.json({ success: true, message: "Catalogue and its images deleted." });
  } catch (error) {
    handleError(res, error);
  }
};

export const updateCatalogueItem = async (req, res) => {
  try {
    const { id, itemId } = req.params;
    if (!isObjectId(id) || !isObjectId(itemId)) {
      return fail(res, 400, "Invalid id.");
    }
    const item = await Lookbook.findOne({ _id: itemId, catalogueId: id });
    if (!item) return fail(res, 404, "Image not found in this catalogue.");
    const b = req.body || {};

    if (b.title !== undefined) {
      const t = str(b.title, 150);
      if (!t) return fail(res, 400, "Title cannot be empty.");
      item.title = t;
    }
    if (b.styleNumber !== undefined) {
      // May be empty (cover / closing pages) and may repeat across pages.
      item.styleNumber = normalizeStyle(b.styleNumber);
    }
    if (b.isPublished !== undefined) item.isPublished = b.isPublished === true;
    await item.save();
    res.json({ success: true, message: "Image updated." });
  } catch (error) {
    handleError(res, error);
  }
};

export const setItemsPublished = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return fail(res, 400, "Invalid catalogue id.");
    const b = req.body || {};
    if (typeof b.isPublished !== "boolean") {
      return fail(res, 400, "isPublished must be true or false.");
    }
    const filter = { catalogueId: id };
    if (Array.isArray(b.ids)) {
      if (!b.ids.length || b.ids.length > 2000 || !b.ids.every(isObjectId)) {
        return fail(res, 400, "Provide 1–2000 valid image ids.");
      }
      filter._id = { $in: b.ids };
    } else if (["page", "embedded"].includes(b.sourceType)) {
      filter.sourceType = b.sourceType;
    } else if (b.sourceType !== "all") {
      return fail(res, 400, "Provide ids or a sourceType (page|embedded|all).");
    }
    const r = await Lookbook.updateMany(filter, {
      $set: { isPublished: b.isPublished },
    });
    res.json({
      success: true,
      modified: r.modifiedCount,
      message: `${r.modifiedCount} image(s) ${b.isPublished ? "published" : "hidden"}.`,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const reorderCatalogueItems = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return fail(res, 400, "Invalid catalogue id.");
    const ids = req.body?.ids;
    if (
      !Array.isArray(ids) ||
      !ids.length ||
      ids.length > 2000 ||
      !ids.every(isObjectId) ||
      new Set(ids).size !== ids.length
    ) {
      return fail(res, 400, "Provide a unique list of valid image ids.");
    }
    const owned = await Lookbook.countDocuments({
      catalogueId: id,
      _id: { $in: ids },
    });
    if (owned !== ids.length) {
      return fail(res, 400, "Some images do not belong to this catalogue.");
    }
    await Lookbook.bulkWrite(
      ids.map((itemId, index) => ({
        updateOne: {
          filter: { _id: itemId, catalogueId: id },
          update: { $set: { sortOrder: (index + 1) * 10 } },
        },
      })),
    );
    res.json({ success: true, message: "Order saved." });
  } catch (error) {
    handleError(res, error);
  }
};

// Legacy item routes must never touch catalogue-generated images: their
// variants/cleanup are managed through the catalogue endpoints above.
export const guardCatalogueItems = async (req, res, next) => {
  try {
    const raw = req.params.id ? [req.params.id] : req.body?.ids;
    const ids = (Array.isArray(raw) ? raw : []).filter(isObjectId);
    if (
      ids.length &&
      (await Lookbook.exists({ _id: { $in: ids }, catalogueId: { $ne: null } }))
    ) {
      return fail(
        res,
        400,
        "This image belongs to a PDF catalogue. Manage it from the Catalogues section.",
      );
    }
    return next();
  } catch (error) {
    return handleError(res, error);
  }
};