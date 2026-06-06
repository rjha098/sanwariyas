// import express from "express";
// import {
//   getLookbook,
//   createLookbookItem,
//   deleteLookbookItem,
// } from "../controllers/lookbookController.js";
// import { uploadLookbook } from '../middlewares/upload.js';

// import { requireAdminAuth } from "../utils/adminAuth.js"; // Aapka purana middleware

// const router = express.Router();

// router.get("/", getLookbook); // Public (Website par dikhane ke liye)
// router.post(
//   "/",
//   requireAdminAuth,
//   uploadLookbook.single("image"),
//   createLookbookItem,
// ); // Admin add karega
// router.delete("/:id", requireAdminAuth, deleteLookbookItem); // Admin delete karega

// export default router;



// FILE: server/routes/lookbookRoutes.js
import express from 'express';
import {
  getLookbook,
  createLookbookItem,
  deleteLookbookItem,
} from '../controllers/lookbookController.js';
import { uploadLookbook } from '../middlewares/upload.js';
import { requireAdmin } from '../utils/authUtils.js'; // ✅ New unified auth

const router = express.Router();

router.get('/', getLookbook);
router.post('/', requireAdmin, uploadLookbook.single('image'), createLookbookItem);
router.delete('/:id', requireAdmin, deleteLookbookItem);

export default router;