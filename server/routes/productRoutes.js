// PURPOSE: Map URLs to controller functions

import express from 'express';
const router = express.Router();
import {
  createProduct,
  deleteProduct,
  getAdminProductById,
  getAdminProducts,
  getProducts,
  getProductBySlug,
  getCategories,
  seedData,
  updateProduct,
} from '../controllers/productController.js';
import { requireAdminAuth } from '../utils/adminAuth.js';

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/admin/list', requireAdminAuth, getAdminProducts);
router.get('/admin/:id', requireAdminAuth, getAdminProductById);
router.get('/seed', requireAdminAuth, seedData);
router.post('/', requireAdminAuth, createProduct);
router.patch('/:id', requireAdminAuth, updateProduct);
router.delete('/:id', requireAdminAuth, deleteProduct);
router.get('/:slug', getProductBySlug);

export default router;
