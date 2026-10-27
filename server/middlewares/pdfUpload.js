// FILE: server/middlewares/pdfUpload.js
// Multer wrapper for catalogue PDFs. Files land in a PRIVATE temp directory
// (never under /uploads, which is publicly served). Real content is verified
// in the controller (magic bytes), not just the extension / MIME header.
import fs from "fs";
import path from "path";
import crypto from "crypto";
import multer from "multer";
import { fileURLToPath } from "url";
import { getLookbookConfig } from "../utils/lookbookConfig.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const PDF_TMP_ROOT = path.join(
  __dirname,
  "..",
  "storage",
  "lookbook-tmp",
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      fs.mkdirSync(PDF_TMP_ROOT, { recursive: true });
      cb(null, PDF_TMP_ROOT);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    cb(null, `upload-${Date.now()}-${crypto.randomBytes(8).toString("hex")}.tmp`);
  },
});

const fileFilter = (req, file, cb) => {
  const okExt = path.extname(file.originalname || "").toLowerCase() === ".pdf";
  const okMime = ["application/pdf", "application/x-pdf"].includes(
    file.mimetype,
  );
  if (okExt && okMime) return cb(null, true);
  return cb(new Error("Only PDF files are allowed."), false);
};

export const handleCataloguePdfUpload = (req, res, next) => {
  const { maxPdfBytes } = getLookbookConfig();
  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: maxPdfBytes, files: 1, fields: 12 },
  }).single("pdf");

  upload(req, res, (err) => {
    if (!err) return next();
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? `PDF is too large. Maximum size is ${Math.round(maxPdfBytes / 1024 / 1024)} MB.`
        : err.message || "PDF upload failed.";
    return res.status(400).json({ success: false, message });
  });
};