import express from "express";
import {
  getLookbook,
  createLookbookItem,
  deleteLookbookItem,
} from "../controllers/lookbookController.js";
import { uploadLookbook } from '../middlewares/upload.js';

import { requireAdminAuth } from "../utils/adminAuth.js"; // Aapka purana middleware

const router = express.Router();

router.get("/", getLookbook); // Public (Website par dikhane ke liye)
router.post(
  "/",
  requireAdminAuth,
  uploadLookbook.single("image"),
  createLookbookItem,
); // Admin add karega
router.delete("/:id", requireAdminAuth, deleteLookbookItem); // Admin delete karega

export default router;
