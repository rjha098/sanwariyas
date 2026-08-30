// FILE: server/routes/blogRoutes.js

import express from "express";
import {
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
  getAdminBlogs,
  getBlogBySlug,
  getCategories,
  createCategory,
  deleteCategory, // Imported the new delete function
} from "../controllers/blogController.js";
import { requireAdmin } from "../utils/authUtils.js";
import { upload, verifyUploadedImages } from "../middlewares/upload.js";

const router = express.Router();

// Public routes
router.get("/", getAllBlogs);
router.get("/categories", getCategories);
router.get("/admin/list", requireAdmin, getAdminBlogs);
router.get("/:slug", getBlogBySlug);

// Admin routes
router.post("/categories", requireAdmin, createCategory);
router.delete("/categories/:id", requireAdmin, deleteCategory); // New Delete Route

router.post(
  "/",
  requireAdmin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  verifyUploadedImages,
  createBlog
);

router.put(
  "/:id",
  requireAdmin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  verifyUploadedImages,
  updateBlog
);

router.delete("/:id", requireAdmin, deleteBlog);

export default router;