// FILE: server/routes/paymentRoutes.js

import express from "express";
import {
  createSession,
  verifyPayment,
  handleWebhook,
} from "../controllers/paymentController.js";
import { requireAuth } from "../utils/authUtils.js";

const router = express.Router();

// Customer-initiated, must be logged in.
router.post("/session/:orderId", requireAuth, createSession);
router.get("/verify/:orderId", requireAuth, verifyPayment);

// Called by Cashfree's servers directly — intentionally NOT behind
// requireAuth. Authenticity is enforced inside handleWebhook via the
// x-webhook-signature check instead.
router.post("/webhook", handleWebhook);

export default router;