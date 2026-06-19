// FILE: server/middlewares/upload.js
import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Combined storage setup for both Lookbook and Blogs
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Decision logic: If request is from blogs, go to uploads/blogs, else lookbook
    const dir = req.originalUrl.includes('blogs') ? 'uploads/blogs' : 'uploads/lookbook';
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Generates unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter (Only images allowed)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed!'), false);
  }
};

// ✅ ADDED: 2MB File Size Limit (2 * 1024 * 1024 bytes)
const limits = {
  fileSize: 2 * 1024 * 1024 
};

// Exports with limits applied to both
export const uploadLookbook = multer({ storage, fileFilter, limits });
export const upload = multer({ storage, fileFilter, limits });