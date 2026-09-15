import express from "express";
import {
  checkProductsAvailability,
  createProduct,
  deleteProduct,
  getAdminProductById,
  getAdminProducts,
  getProducts,
  getProductBySlug,
  getCategories,
  seedData,
  updateProduct,
} from "../controllers/productController.js";

import { requireAdmin } from "../utils/authUtils.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

//  Specific routes FIRST
router.get("/", getProducts);
router.get("/categories", getCategories);
router.post("/check-availability", checkProductsAvailability);

// Admin-protected (must come before /:slug)
router.get("/admin/list", requireAdmin, getAdminProducts);
router.get("/admin/:id", requireAdmin, getAdminProductById);
router.get("/seed", requireAdmin, seedData);
router.post(
  "/",
  requireAdmin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 4 },
  ]),
  createProduct,
);
router.patch(
  "/:id",
  requireAdmin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 4 },
  ]),
  updateProduct,
);
router.delete("/:id", requireAdmin, deleteProduct);

//  Wildcard LAST
router.get("/:slug", getProductBySlug);

export default router;
