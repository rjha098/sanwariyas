// FILE: server/middlewares/inquiryUpload.js
//
// usage ---- Handles the OPTIONAL "sampleImages" upload on POST /api/inquiry.
//   • max 2 files, max 3MB each, JPG/JPEG/PNG/WEBP only
//   • layer 1 (Multer fileFilter): MIME type AND file extension must agree
//   • layer 2 (after upload): real file content is read via magic bytes, so a
//     renamed .exe / .svg / .pdf can never be stored as an image
//   • files get a random server-generated name; the client's filename is never used
//   • every failure is returned as JSON { success:false, message } (the shared
//     global error handler is NOT used here because it reports a "2MB" limit)
//
// NOTE: this is a separate file on purpose — the shared middlewares/upload.js is
// hard-wired to a 2MB limit, allows GIF, and picks its folder from the URL.

import crypto from "crypto";
import fs from "fs";
import path from "path";
import multer from "multer";
import mongoSanitize from "express-mongo-sanitize";
import { fileTypeFromFile } from "file-type";

export const INQUIRY_FIELD_NAME = "sampleImages";
export const MAX_INQUIRY_IMAGES = 2;
export const MAX_INQUIRY_IMAGE_SIZE = 3 * 1024 * 1024; // 3MB

// Same relative folder convention as the rest of the project
// (server/index.js serves it with: app.use("/uploads", express.static("uploads")))
const UPLOAD_DIR = path.join("uploads", "inquiries");
const PUBLIC_PREFIX = "/uploads/inquiries";

// detected/declared MIME -> extension we store, and the extensions allowed for it
const ALLOWED_TYPES = {
  "image/jpeg": { ext: ".jpg", accepts: [".jpg", ".jpeg"] },
  "image/png": { ext: ".png", accepts: [".png"] },
  "image/webp": { ext: ".webp", accepts: [".webp"] },
};

const TYPE_ERROR_MESSAGE = "Only JPG, JPEG, PNG or WEBP images are allowed.";
const COUNT_ERROR_MESSAGE = `You can upload a maximum of ${MAX_INQUIRY_IMAGES} images.`;
const SIZE_ERROR_MESSAGE = "Each image must be 3MB or smaller.";

// "/uploads/inquiries/<filename>" — the only form that is ever stored in MongoDB
export const toPublicPath = (filename) => `${PUBLIC_PREFIX}/${filename}`;

// Best-effort delete of uploaded files (never throws)
export const removeUploadedFiles = async (files = []) => {
  await Promise.allSettled(
    files.filter((f) => f?.path).map((f) => fs.promises.unlink(f.path)),
  );
};

const storage = multer.diskStorage({
  destination: UPLOAD_DIR, // Multer creates it (recursively) if missing
  filename: (req, file, cb) => {
    // Temporary name — renamed to the verified extension after the content check.
    cb(null, `${Date.now()}-${crypto.randomBytes(8).toString("hex")}.tmp`);
  },
});

const fileFilter = (req, file, cb) => {
  const rule = ALLOWED_TYPES[file.mimetype];
  const ext = path.extname(file.originalname || "").toLowerCase();

  if (rule && rule.accepts.includes(ext)) return cb(null, true);

  const err = new Error(TYPE_ERROR_MESSAGE);
  err.code = "INVALID_FILE_TYPE";
  return cb(err, false);
};

const uploadSampleImages = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_INQUIRY_IMAGE_SIZE,
    files: MAX_INQUIRY_IMAGES,
    fields: 30, // inquiry forms send ~10 text fields
    fieldSize: 100 * 1024, // 100KB per text field (message max is 3000 chars)
  },
}).array(INQUIRY_FIELD_NAME, MAX_INQUIRY_IMAGES);

const describeUploadError = (err) => {
  switch (err.code) {
    case "LIMIT_FILE_SIZE":
      return { status: 400, message: SIZE_ERROR_MESSAGE };
    case "LIMIT_FILE_COUNT":
      return { status: 400, message: COUNT_ERROR_MESSAGE };
    case "LIMIT_UNEXPECTED_FILE":
      // Thrown for a 3rd "sampleImages" file AND for files under any other field name
      return err.field === INQUIRY_FIELD_NAME
        ? { status: 400, message: COUNT_ERROR_MESSAGE }
        : { status: 400, message: "Unexpected file field in the upload." };
    case "INVALID_FILE_TYPE":
      return { status: 400, message: TYPE_ERROR_MESSAGE };
    default:
      if (err instanceof multer.MulterError) {
        return { status: 400, message: "Image upload failed. Please check your files and try again." };
      }
      return { status: 500, message: "Failed to upload images. Please try again." };
  }
};

// Runs AFTER Multer: verifies real content, renames .tmp -> final extension.
const verifyInquiryImages = async (req, res, next) => {
  const files = Array.isArray(req.files) ? req.files : [];

  try {
    for (const file of files) {
      const detected = await fileTypeFromFile(file.path);
      const rule = detected ? ALLOWED_TYPES[detected.mime] : null;

      if (!rule) {
        await removeUploadedFiles(files);
        return res.status(400).json({
          success: false,
          message: "One of the uploaded files is not a valid JPG, PNG or WEBP image.",
        });
      }

      const finalPath = file.path.replace(/\.tmp$/, rule.ext);
      await fs.promises.rename(file.path, finalPath);
      file.path = finalPath;
      file.filename = path.basename(finalPath);
    }
    return next();
  } catch (err) {
    await removeUploadedFiles(files);
    return res.status(500).json({
      success: false,
      message: "Failed to process uploaded images. Please try again.",
    });
  }
};

// The middleware to mount on the route.
// JSON (non-multipart) requests pass straight through: Multer ignores them and
// req.files stays undefined, so existing API clients keep working.
export const handleInquiryUpload = (req, res, next) => {
  uploadSampleImages(req, res, (err) => {
    if (err) {
      const { status, message } = describeUploadError(err);
      return res.status(status).json({ success: false, message });
    }

    // server/index.js runs mongoSanitize() BEFORE Multer has parsed a multipart
    // body, so sanitize the multipart text fields here to keep the same protection.
    if (req.body) req.body = mongoSanitize.sanitize(req.body);

    return verifyInquiryImages(req, res, next);
  });
};