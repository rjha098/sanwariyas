// // FILE: server/middlewares/upload.js
// import multer from "multer";
// import fs from "fs";
// import path from "path";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Decision logic: route uploads to the correct folder based on which API called it
//     let dir = "uploads/lookbook";
//     if (req.originalUrl.includes("blogs")) dir = "uploads/blogs";
//     else if (req.originalUrl.includes("products")) dir = "uploads/products";

//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//     }
//     cb(null, dir);
//   },

//   filename: (req, file, cb) => {
//     // Generates unique filename
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   },
// });

// const ALLOWED_MIME = new Set([
//   "image/jpeg",
//   "image/png",
//   "image/webp",
//   "image/gif",
// ]);
// const fileFilter = (req, file, cb) => {
//   if (ALLOWED_MIME.has(file.mimetype)) cb(null, true);
//   else cb(new Error("Only JPEG, PNG, WEBP or GIF images are allowed!"), false);
// };

// //  ADDED: 2MB File Size Limit (2 * 1024 * 1024 bytes)
// const limits = {
//   fileSize: 2 * 1024 * 1024,
// };

// // Exports with limits applied to both
// export const uploadLookbook = multer({ storage, fileFilter, limits });
// export const upload = multer({ storage, fileFilter, limits });



// server/middlewares/upload.js
import fs from "fs";
import path from "path";
import multer from "multer";
import { fileTypeFromFile } from "file-type";

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MIME_TO_EXT = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/gif": ".gif" };

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir = "uploads/lookbook";
    if (req.originalUrl.includes("blogs")) dir = "uploads/blogs";
    else if (req.originalUrl.includes("products")) dir = "uploads/products";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Temp name; renamed to the verified extension in postProcessUpload below.
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + ".tmp");
  },
});

const fileFilter = (req, file, cb) => {
  // First-pass header check (cheap reject for obviously wrong types)
  if (ALLOWED_MIME.has(file.mimetype)) cb(null, true);
  else cb(new Error("Only JPEG, PNG, WEBP or GIF images are allowed!"), false);
};

export const upload = multer({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } });

// Run this AFTER multer, before the controller — verifies real content and
// renames to a trustworthy extension; deletes the file if it's not really an image.
export const uploadLookbook = upload;

export const verifyUploadedImages = async (req, res, next) => {
  try {
    const allFiles = req.files ? Object.values(req.files).flat() : req.file ? [req.file] : [];
    for (const f of allFiles) {
      const type = await fileTypeFromFile(f.path);
      if (!type || !ALLOWED_MIME.has(type.mime)) {
        if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
        return res.status(400).json({ success: false, message: "Uploaded file is not a valid image." });
      }
      const finalPath = f.path.replace(/\.tmp$/, MIME_TO_EXT[type.mime]);
      fs.renameSync(f.path, finalPath);
      f.filename = path.basename(finalPath);
      f.path = finalPath;
    }
    next();
  } catch (err) {
    return res.status(400).json({ success: false, message: "Failed to process uploaded file." });
  }
};