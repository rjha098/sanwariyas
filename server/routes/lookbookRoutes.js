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