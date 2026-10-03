// // FILE: server/routes/inquiryRoutes.js
// import express from 'express';
// import {
//   submitInquiry,
//   getInquiries,
//   updateStatus,
//   getMyInquiries,
//   replyToInquiry,
//   markViewed,
//   getSingleInquiry,
//   deleteInquiry
// } from '../controllers/inquiryController.js';
// import { requireAdmin, requireAuth } from '../utils/authUtils.js';

// const router = express.Router();

// // Customer/Guest routes
// router.post('/', submitInquiry);
// router.get('/my-inquiries', requireAuth, getMyInquiries);

// // Shared reply and view routes
// router.post('/:id/reply', requireAuth, replyToInquiry);
// router.patch('/:id/viewed', requireAuth, markViewed);

// // Admin routes
// router.get('/', requireAdmin, getInquiries);
// router.patch('/:id/status', requireAdmin, updateStatus);
// router.get('/:id', requireAdmin, getSingleInquiry);
// router.delete('/:id', requireAdmin, deleteInquiry);

// export default router;
// FILE: server/routes/inquiryRoutes.js
import express from "express";
import {
  submitInquiry,
  getInquiries,
  updateStatus,
  getMyInquiries,
  replyToInquiry,
  markViewed,
  getSingleInquiry,
  deleteInquiry,
} from "../controllers/inquiryController.js";
import { requireAdmin, requireAuth } from "../utils/authUtils.js";
import { handleInquiryUpload } from "../middlewares/inquiryUpload.js";

const router = express.Router();

// Customer/Guest routes
router.post("/", handleInquiryUpload, submitInquiry);
router.get("/my-inquiries", requireAuth, getMyInquiries);

// Shared reply and view routes
router.post("/:id/reply", requireAuth, replyToInquiry);
router.patch("/:id/viewed", requireAuth, markViewed);

// Admin routes
router.get("/", requireAdmin, getInquiries);
router.patch("/:id/status", requireAdmin, updateStatus);
router.get("/:id", requireAdmin, getSingleInquiry);
router.delete("/:id", requireAdmin, deleteInquiry);

export default router;
