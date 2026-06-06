// // PURPOSE: Map URLs to inquiry controller functions



// import express from 'express';
// import { submitInquiry, getInquiries, updateStatus } from '../controllers/inquiryController.js';
// import { requireAdminAuth } from '../utils/adminAuth.js';

// const router = express.Router();

// router.post('/', submitInquiry);
// router.get('/', requireAdminAuth, getInquiries);
// router.patch('/:id/status', requireAdminAuth, updateStatus);

// export default router;


// FILE: server/routes/inquiryRoutes.js
import express from 'express';
import { submitInquiry, getInquiries, updateStatus } from '../controllers/inquiryController.js';
import { requireAdmin } from '../utils/authUtils.js';

const router = express.Router();

// Guest: anyone can submit an inquiry (order/question flow)
router.post('/', submitInquiry);

// Admin-protected
router.get('/', requireAdmin, getInquiries);
router.patch('/:id/status', requireAdmin, updateStatus);

export default router;