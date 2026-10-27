// FILE: server/utils/pageLabel.js
// Reads the design label printed on a catalogue page, e.g.
//   "S - 761(A) / Pure Cotton Fabric / M To 3XL / 335 /-"
// and returns { code: "S-761(A)", details: "Pure Cotton Fabric / M To 3XL / 335 /-" }.
//
// Order: 1) real PDF text (pdftotext - fast, exact)
//        2) OCR with Tesseract on the rendered page (only if installed)
// Anything missing or unreadable returns null and the caller keeps the
// automatic SW-xxxx style number.
import { execFile } from "child_process";
import fsp from "fs/promises";
import path from "path";

const run = (bin, args, timeout) =>
  new Promise((resolve, reject) => {
    execFile(
      bin,
      args,
      { timeout, maxBuffer: 8 * 1024 * 1024, windowsHide: true },
      (err, stdout) => (err ? reject(err) : resolve(stdout)),
    );
  });

const CODE_RE = /^[A-Z][A-Z0-9 .'()&_-]{0,30}$|^\d[A-Z0-9 .'()&_-]{1,30}$/;

const cleanCode = (raw) =>
  String(raw)
    .toUpperCase()
    .replace(/[\u2010-\u2015\u2212]/g, "-")
    .replace(/[`’‘]/g, "'")
    .replace(/\s*-\s*/g, "-")
    .replace(/\s*\(\s*/g, "(")
    .replace(/\s*\)\s*/g, ")")
    .replace(/\s+/g, " ")
    .replace(/^[^A-Z0-9]+|[^A-Z0-9)]+$/g, "")
    .trim();

// Pure function: picks the first "CODE / detail / detail ..." line.
export const parsePageLabel = (text) => {
  const lines = String(text || "")
    .replace(/[|\\]/g, "/")
    .split(/\r?\n/)
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  for (const line of lines) {
    const parts = line
      .split("/")
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length < 3) continue; // a real label has code + at least two details
    const code = cleanCode(parts[0]);
    if (code.length < 3 || code.length > 30) continue;
    // a real design code has letters AND digits (S-761(A), SU'B-31); bare
    // numbers are usually OCR noise such as page furniture or prices
    if (!/\d/.test(code) || !/[A-Z]/.test(code) || !CODE_RE.test(code)) continue;
    // and the rest of the line must read like words (fabric / size / rate)
    if (!/[A-Za-z]{3,}/.test(parts.slice(1).join(" "))) continue;
    const details = parts
      .slice(1)
      .join(" / ")
      .replace(/ \/ -$/, " /-")
      .slice(0, 200);
    return { code: code.slice(0, 40), details };
  }
  return null;
};

let ocrAvailable = null; // cached after the first check
const hasTesseract = async (cfg) => {
  if (cfg.ocrMode === "off") return false;
  if (ocrAvailable !== null) return ocrAvailable;
  try {
    await run(cfg.tesseract, ["--version"], 10000);
    ocrAvailable = true;
  } catch {
    ocrAvailable = false;
    console.warn(
      "[lookbook-pdf] Tesseract not found - style numbers from images are skipped. Set TESSERACT_PATH or install Tesseract to enable OCR.",
    );
  }
  return ocrAvailable;
};

// Small label text on a photo only OCRs reliably after upscaling + a hard
// black/white threshold. `invert` handles light text on a dark label.
const ocrImage = async (cfg, sharp, pngPath, workDir, tag, region, invert) => {
  const prepared = path.join(workDir, `ocr-${tag}.png`);
  try {
    const opts = { limitInputPixels: cfg.maxInputPixels };
    const meta = await sharp(pngPath, opts).metadata();
    let img = sharp(pngPath, opts);
    if (region === "bottom") {
      const top = Math.floor(meta.height * 0.68);
      img = img.extract({
        left: 0,
        top,
        width: meta.width,
        height: meta.height - top,
      });
    }
    img = img.grayscale().resize({ width: 2400 }).normalise();
    if (invert) img = img.negate();
    await img.threshold(120).png().toFile(prepared);
    return await run(
      cfg.tesseract,
      [prepared, "stdout", "-l", "eng", "--psm", "6"],
      cfg.ocrTimeoutMs,
    );
  } finally {
    await fsp.rm(prepared, { force: true });
  }
};

const OCR_PASSES = [
  { region: "bottom", invert: false },
  { region: "bottom", invert: true },
  { region: "full", invert: false },
];

// Never throws: label reading must not be able to fail a catalogue.
export const readPageLabel = async ({
  cfg,
  sharp,
  pdfPath,
  page,
  pngPath,
  workDir,
}) => {
  try {
    const text = await run(
      cfg.pdftotext,
      ["-f", String(page), "-l", String(page), "-layout", pdfPath, "-"],
      cfg.toolTimeoutMs,
    ).catch(() => "");
    const fromText = parsePageLabel(text);
    if (fromText) return { ...fromText, source: "pdf-text" };

    if (!(await hasTesseract(cfg))) return null;
    for (const [i, pass] of OCR_PASSES.entries()) {
      const out = await ocrImage(
        cfg,
        sharp,
        pngPath,
        workDir,
        `${page}-${i}`,
        pass.region,
        pass.invert,
      ).catch(() => "");
      const found = parsePageLabel(out);
      if (found) return { ...found, source: "ocr" };
    }
    return null;
  } catch {
    return null;
  }
};