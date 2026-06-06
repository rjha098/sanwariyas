// // // PURPOSE: Map URLs to controller functions

// // import express from 'express';
// // const router = express.Router();
// // import {
// //   createProduct,
// //   deleteProduct,
// //   getAdminProductById,
// //   getAdminProducts,
// //   getProducts,
// //   getProductBySlug,
// //   getCategories,
// //   seedData,
// //   updateProduct,
// // } from '../controllers/productController.js';
// // import { requireAdminAuth } from '../utils/adminAuth.js';

// // router.get('/', getProducts);
// // router.get('/categories', getCategories);
// // router.get('/admin/list', requireAdminAuth, getAdminProducts);
// // router.get('/admin/:id', requireAdminAuth, getAdminProductById);
// // router.get('/seed', requireAdminAuth, seedData);
// // router.post('/', requireAdminAuth, createProduct);
// // router.patch('/:id', requireAdminAuth, updateProduct);
// // router.delete('/:id', requireAdminAuth, deleteProduct);
// // router.get('/:slug', getProductBySlug);

// // export default router;


// // FILE: server/routes/productRoutes.js
// import express from 'express';
// import {
//   createProduct, deleteProduct, getAdminProductById, getAdminProducts,
//   getProducts, getProductBySlug, getCategories, seedData, updateProduct,
// } from '../controllers/productController.js';
// import { requireAdmin } from '../utils/authUtils.js';

// const router = express.Router();

// // Public
// router.get('/', getProducts);
// router.get('/categories', getCategories);
// router.get('/:slug', getProductBySlug);

// // Admin-protected
// router.get('/admin/list', requireAdmin, getAdminProducts);
// router.get('/admin/:id', requireAdmin, getAdminProductById);
// router.get('/seed', requireAdmin, seedData);
// router.post('/', requireAdmin, createProduct);
// router.patch('/:id', requireAdmin, updateProduct);
// router.delete('/:id', requireAdmin, deleteProduct);

// export default router;


// FILE: server/routes/productRoutes.js
import express from 'express';
import {
  createProduct, deleteProduct, getAdminProductById, getAdminProducts,
  getProducts, getProductBySlug, getCategories, seedData, updateProduct,
} from '../controllers/productController.js';
import { requireAdmin } from '../utils/authUtils.js';

const router = express.Router();

// ✅ Specific routes FIRST
router.get('/', getProducts);
router.get('/categories', getCategories);

// Admin-protected (must come before /:slug)
router.get('/admin/list', requireAdmin, getAdminProducts);
router.get('/admin/:id', requireAdmin, getAdminProductById);
router.get('/seed', requireAdmin, seedData);
router.post('/', requireAdmin, createProduct);
router.patch('/:id', requireAdmin, updateProduct);
router.delete('/:id', requireAdmin, deleteProduct);

// ✅ Wildcard LAST
router.get('/:slug', getProductBySlug);

export default router;