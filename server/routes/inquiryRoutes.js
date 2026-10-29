// // FILE: server/routes/inquiryRoutes.js
// import express from "express";
// import {
//   submitInquiry,
//   getInquiries,
//   updateStatus,
//   getMyInquiries,
//   replyToInquiry,
//   markViewed,
//   getSingleInquiry,
//   deleteInquiry,
//   claimRequest,
//   claimConfirm,
// } from "../controllers/inquiryController.js";
// import { requireAdmin, requireAuth } from "../utils/authUtils.js";
// import { handleInquiryUpload } from "../middlewares/inquiryUpload.js";

// const router = express.Router();

// // Customer/Guest routes
// router.post("/", handleInquiryUpload, submitInquiry);
// router.get("/my-inquiries", requireAuth, getMyInquiries);

// // Attach earlier guest inquiries to this account (email-code verified).
// router.post("/claim/request", requireAuth, claimRequest);
// router.post("/claim/confirm", requireAuth, claimConfirm);

// // Shared reply and view routes
// router.post("/:id/reply", requireAuth, replyToInquiry);
// router.patch("/:id/viewed", requireAuth, markViewed);

// // Admin routes
// router.get("/", requireAdmin, getInquiries);
// router.patch("/:id/status", requireAdmin, updateStatus);
// router.get("/:id", requireAdmin, getSingleInquiry);
// router.delete("/:id", requireAdmin, deleteInquiry);

// export default router;







// FILE: server/routes/inquiryRoutes.js
import express from "express";
import rateLimit from "express-rate-limit";
import {
  submitInquiry,
  getInquiries,
  updateStatus,
  getMyInquiries,
  replyToInquiry,
  markViewed,
  getSingleInquiry,
  deleteInquiry,
  claimRequest,
  claimConfirm,
  exportInquiries,
  addContactLog,
  deleteContactLog,
} from "../controllers/inquiryController.js";
import { requireAdmin, requireAuth } from "../utils/authUtils.js";
import { handleInquiryUpload } from "../middlewares/inquiryUpload.js";

const router = express.Router();

// Excel export is heavy: allow a handful per minute per client.
const exportLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 6,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many exports. Please wait a minute and try again.",
  },
});

// Customer/Guest routes
router.post("/", handleInquiryUpload, submitInquiry);
router.get("/my-inquiries", requireAuth, getMyInquiries);

// Attach earlier guest inquiries to this account (email-code verified).
router.post("/claim/request", requireAuth, claimRequest);
router.post("/claim/confirm", requireAuth, claimConfirm);

// Shared reply and view routes
router.post("/:id/reply", requireAuth, replyToInquiry);
router.patch("/:id/viewed", requireAuth, markViewed);

// Admin routes
router.get("/", requireAdmin, getInquiries);
// Must stay ABOVE "/:id" or "export" would be treated as an inquiry id.
router.get("/export", requireAdmin, exportLimiter, exportInquiries);
router.post("/:id/contact-logs", requireAdmin, addContactLog);
router.delete("/:id/contact-logs/:logId", requireAdmin, deleteContactLog);
router.patch("/:id/status", requireAdmin, updateStatus);
router.get("/:id", requireAdmin, getSingleInquiry);
router.delete("/:id", requireAdmin, deleteInquiry);

export default router;