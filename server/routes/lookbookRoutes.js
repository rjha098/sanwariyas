// FILE: server/routes/lookbookRoutes.js
import {
  upload as uploadLookbook,
  verifyUploadedImages,
} from "../middlewares/upload.js";
import express from "express";
import {
  getLookbook,
  createLookbookItem,
  deleteLookbookItem,
} from "../controllers/lookbookController.js";
import { requireAdmin } from "../utils/authUtils.js";

const router = express.Router();

router.get("/", getLookbook);

// router.post('/', requireAdmin, uploadLookbook.single('image'), createLookbookItem);

router.post(
  "/",
  requireAdmin,
  uploadLookbook.single("image"),
  verifyUploadedImages,
  createLookbookItem,
);

router.delete("/:id", requireAdmin, deleteLookbookItem);

export default router;
