// FILE: server/routes/lookbookRoutes.js
import {
  upload as uploadLookbook,
  verifyUploadedImages,
} from "../middlewares/upload.js";
import { handleCataloguePdfUpload } from "../middlewares/pdfUpload.js";
import express from "express";
import {
  createLookbookItem,
  updateLookbookItem,
  deleteLookbookItem,
  bulkDeleteLookbookItems,
} from "../controllers/lookbookController.js";
import {
  getLookbookPublicConfig,
  getPublishedCatalogues,
  getPublicLookbook,
  listCatalogues,
  getCatalogue,
  createCatalogue,
  retryCatalogue,
  updateCatalogue,
  deleteCatalogue,
  updateCatalogueItem,
  setItemsPublished,
  reorderCatalogueItems,
  guardCatalogueItems,
} from "../controllers/lookbookCatalogueController.js";
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

import { makeRateLimitStore } from "../utils/mongoRateLimitStore.js";

import { requireAdmin } from "../utils/authUtils.js";

const router = express.Router();

// ── Lookbook inquiries (own collection, separate from /api/inquiries) ─────
const lookbookInquiryLimiter = rateLimit({
  store: makeRateLimitStore("lookbook-inquiry"),
  passOnStoreError: true,
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

// ── PDF catalogues ─────────────────────────────────────────────────────────
// Public: settings (WhatsApp number from server env) + published catalogues.
router.get("/config", getLookbookPublicConfig);
router.get("/catalogues", getPublishedCatalogues);

// Admin (all behind requireAdmin).
router.get("/catalogues/admin/all", requireAdmin, listCatalogues);
router.get("/catalogues/admin/:id", requireAdmin, getCatalogue);
router.post(
  "/catalogues",
  requireAdmin,
  handleCataloguePdfUpload,
  createCatalogue,
);
router.post("/catalogues/:id/retry", requireAdmin, retryCatalogue);
router.patch("/catalogues/:id", requireAdmin, express.json(), updateCatalogue);
router.delete("/catalogues/:id", requireAdmin, deleteCatalogue);
router.put(
  "/catalogues/:id/order",
  requireAdmin,
  express.json({ limit: "512kb" }),
  reorderCatalogueItems,
);
router.post(
  "/catalogues/:id/publish-items",
  requireAdmin,
  express.json({ limit: "512kb" }),
  setItemsPublished,
);
router.patch(
  "/catalogues/:id/items/:itemId",
  requireAdmin,
  express.json(),
  updateCatalogueItem,
);

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

// Public feed. Default response is unchanged (legacy single photos);
// ?scope=all / ?catalogue=<id> add published PDF-catalogue images.
router.get("/", getPublicLookbook);

router.post(
  "/",
  requireAdmin,
  handleLookbookUpload,
  verifyUploadedImages,
  createLookbookItem,
);

router.post(
  "/bulk-delete",
  requireAdmin,
  guardCatalogueItems,
  bulkDeleteLookbookItems,
);

router.patch(
  "/:id",
  requireAdmin,
  guardCatalogueItems,
  handleLookbookUpload,
  verifyUploadedImages,
  updateLookbookItem,
);

router.delete("/:id", requireAdmin, guardCatalogueItems, deleteLookbookItem);

export default router;
