// FILE: server/routes/blogRoutes.js
import express from 'express';
import {
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
  getAdminBlogs,
  getBlogBySlug,
  getCategories,
  createCategory,
} from '../controllers/blogController.js';
import { requireAdmin } from '../utils/authUtils.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

// Public routes
router.get('/',              getAllBlogs);
router.get('/categories',    getCategories);
router.get('/admin/list',    requireAdmin, getAdminBlogs);
router.get('/:slug',         getBlogBySlug);

// Admin routes
router.post('/categories',   requireAdmin, createCategory);
router.post('/',             requireAdmin, upload.single('image'), createBlog);
router.put('/:id',           requireAdmin, upload.single('image'), updateBlog);
router.delete('/:id',        requireAdmin, deleteBlog);

export default router;