// FILE: server/routes/orderRoutes.js

import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderDetail,
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
  getAnalytics,
} from "../controllers/orderController.js";
import { requireAuth, requireStaff } from "../utils/authUtils.js";

const router = express.Router();

// Customer routes
router.post("/", requireAuth, createOrder);
router.get("/my-orders", requireAuth, getMyOrders);

// Admin routes (must come before /:id to avoid path collision)
router.get("/analytics", requireStaff, getAnalytics);
router.get("/", requireStaff, getAllOrdersAdmin);
router.patch("/:id/status", requireStaff, updateOrderStatusAdmin);

// Shared (ownership-checked inside controller)
router.get("/:id", requireAuth, getOrderDetail);

export default router;