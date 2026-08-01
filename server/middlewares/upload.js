// FILE: server/middlewares/upload.js
import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Decision logic: route uploads to the correct folder based on which API called it
    let dir = "uploads/lookbook";
    if (req.originalUrl.includes("blogs")) dir = "uploads/blogs";
    else if (req.originalUrl.includes("products")) dir = "uploads/products";

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },

  filename: (req, file, cb) => {
    // Generates unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME.has(file.mimetype)) cb(null, true);
  else cb(new Error("Only JPEG, PNG, WEBP or GIF images are allowed!"), false);
};

//  ADDED: 2MB File Size Limit (2 * 1024 * 1024 bytes)
const limits = {
  fileSize: 2 * 1024 * 1024,
};

// Exports with limits applied to both
export const uploadLookbook = multer({ storage, fileFilter, limits });
export const upload = multer({ storage, fileFilter, limits });
