// PURPOSE: Map URLs to inquiry controller functions



import express from 'express';
import { submitInquiry, getInquiries, updateStatus } from '../controllers/inquiryController.js';
import { requireAdminAuth } from '../utils/adminAuth.js';

const router = express.Router();

router.post('/', submitInquiry);
router.get('/', requireAdminAuth, getInquiries);
router.patch('/:id/status', requireAdminAuth, updateStatus);

export default router;
