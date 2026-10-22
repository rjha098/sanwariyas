// FILE: server/routes/authRoutes.js

import express from "express";
import {
  login,
  verifyOtp,
  session,
  logout,
  customerSignup,
  verifyEmail,
  updateProfile,
  getMe,
  deleteAccount,
  heartbeat,
  toggleVisibility,
  getVisibility,
  setOffline,
  forgotPassword,
  googleLogin,
  googleComplete,
  googleLinkExisting,
  googleLinkCurrent,
  resetStatus,
  getSecurity,
  accountOtpStatus,
  setPasswordRequest,
  setPasswordConfirm,
  verifyResetCode,
  resetPassword,
  createStaffAccount,
  getAllStaff,
  updateStaffStatus,
  deleteStaffAccount,
} from "../controllers/authController.js";

import { requireAuth, requireStaff, requireAdmin } from "../utils/authUtils.js";
import { validateSignup } from "../middlewares/validateSignup.js";

const router = express.Router();

router.post("/customer/signup", validateSignup, customerSignup);
router.get("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/verify-otp", verifyOtp);
router.get("/session", session);
router.post("/logout", logout);

// Google sign-in (ID-token flow)
router.post("/google", googleLogin);
router.post("/google/complete", googleComplete);
// Connect Google to an existing PASSWORD account (password proves ownership)
router.post("/google/link-existing", googleLinkExisting);
// Connect Google while already signed in
router.post("/google/link", requireAuth, googleLinkCurrent);

// Password-reset lockout / resend state for the UI (same answer for any email)
router.post("/reset-status", resetStatus);

// Account security (signed-in customers)
router.get("/security", requireAuth, getSecurity);
router.get("/account/otp-status", requireAuth, accountOtpStatus);
router.post("/password/set/request", requireAuth, setPasswordRequest);
router.post("/password/set/confirm", requireAuth, setPasswordConfirm);

// Forgot Password Routes
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password", resetPassword);

// Profile Routes (using requireAuth)
router.get("/me", requireAuth, getMe);
router.put("/profile", requireAuth, updateProfile);
router.delete("/delete-account", requireAuth, deleteAccount);

// Online Status Routes
router.post("/heartbeat", requireAuth, heartbeat);
router.patch("/visibility", requireAuth, toggleVisibility);
router.get("/visibility", requireAuth, getVisibility);
router.post("/offline", requireAuth, setOffline);

//  PHASE 2 STAFF MANAGEMENT ROUTES (Admin/Staff Restricted)
router.post("/staff", requireAdmin, createStaffAccount);
router.get("/staff", requireStaff, getAllStaff);
router.patch("/staff/:id", requireAdmin, updateStaffStatus);
router.delete("/staff/:id", requireAdmin, deleteStaffAccount);

export default router;
