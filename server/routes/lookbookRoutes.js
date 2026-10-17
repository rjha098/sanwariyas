// // FILE: server/routes/lookbookRoutes.js

// import {
//   upload as uploadLookbook,
//   verifyUploadedImages,
// } from "../middlewares/upload.js";
// import express from "express";
// import {
//   getLookbook,
//   createLookbookItem,
//   updateLookbookItem,
//   deleteLookbookItem,
//   bulkDeleteLookbookItems,
// } from "../controllers/lookbookController.js";
// import { requireAdmin } from "../utils/authUtils.js";

// const router = express.Router();

// // Runs multer and converts its errors (wrong type / >2MB) into clean 400 JSON
// // responses instead of falling through to the global handler as HTTP 500.
// const handleLookbookUpload = (req, res, next) => {
//   uploadLookbook.single("image")(req, res, (err) => {
//     if (!err) return next();
//     const message =
//       err.code === "LIMIT_FILE_SIZE"
//         ? "Photo size is too large! Maximum limit is 2MB."
//         : err.message || "Image upload failed.";
//     return res.status(400).json({ success: false, message });
//   });
// };

// router.get("/", getLookbook);

// // router.post('/', requireAdmin, uploadLookbook.single('image'), createLookbookItem);

// router.post(
//   "/",
//   requireAdmin,
//   handleLookbookUpload,
//   verifyUploadedImages,
//   createLookbookItem,
// );

// router.post("/bulk-delete", requireAdmin, bulkDeleteLookbookItems);

// router.patch(
//   "/:id",
//   requireAdmin,
//   handleLookbookUpload,
//   verifyUploadedImages,
//   updateLookbookItem,
// );

// router.delete("/:id", requireAdmin, deleteLookbookItem);

// export default router;



// FILE: server/routes/lookbookRoutes.js
import {
  upload as uploadLookbook,
  verifyUploadedImages,
} from "../middlewares/upload.js";
import express from "express";
import {
  getLookbook,
  createLookbookItem,
  updateLookbookItem,
  deleteLookbookItem,
  bulkDeleteLookbookItems,
} from "../controllers/lookbookController.js";
import {
  getActiveQuestions,
  getAllQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../controllers/lookbookQuestionController.js";
import {
  createLookbookInquiry,
  getLookbookInquiries,
  updateLookbookInquiry,
  deleteLookbookInquiry,
} from "../controllers/lookbookInquiryController.js";
import rateLimit from "express-rate-limit";
import { requireAdmin } from "../utils/authUtils.js";

const router = express.Router();

// ── Lookbook inquiries (own collection, separate from /api/inquiries) ─────
const lookbookInquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many inquiries. Please try again later.",
  },
});
router.post(
  "/inquiries",
  lookbookInquiryLimiter,
  express.json(),
  createLookbookInquiry,
);
router.get("/inquiries", requireAdmin, getLookbookInquiries);
router.patch(
  "/inquiries/:id",
  requireAdmin,
  express.json(),
  updateLookbookInquiry,
);
router.delete("/inquiries/:id", requireAdmin, deleteLookbookInquiry);

// ── Magazine questions (must stay ABOVE the "/:id" routes) ────────────────
router.get("/questions", getActiveQuestions);
router.get("/questions/all", requireAdmin, getAllQuestions);
router.post("/questions", requireAdmin, express.json(), createQuestion);
router.patch("/questions/:id", requireAdmin, express.json(), updateQuestion);
router.delete("/questions/:id", requireAdmin, deleteQuestion);

// Runs multer and converts its errors (wrong type / >2MB) into clean 400 JSON
// responses instead of falling through to the global handler as HTTP 500.
const handleLookbookUpload = (req, res, next) => {
  uploadLookbook.single("image")(req, res, (err) => {
    if (!err) return next();
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "Photo size is too large! Maximum limit is 2MB."
        : err.message || "Image upload failed.";
    return res.status(400).json({ success: false, message });
  });
};

router.get("/", getLookbook);

// router.post('/', requireAdmin, uploadLookbook.single('image'), createLookbookItem);

router.post(
  "/",
  requireAdmin,
  handleLookbookUpload,
  verifyUploadedImages,
  createLookbookItem,
);

router.post("/bulk-delete", requireAdmin, bulkDeleteLookbookItems);

router.patch(
  "/:id",
  requireAdmin,
  handleLookbookUpload,
  verifyUploadedImages,
  updateLookbookItem,
);

router.delete("/:id", requireAdmin, deleteLookbookItem);

export default router;
