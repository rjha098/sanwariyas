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
  resetPassword,
  createStaffAccount,
  getAllStaff,
  updateStaffStatus,
  deleteStaffAccount,
} from "../controllers/authController.js";

import { requireAuth, requireStaff } from "../utils/authUtils.js";

const router = express.Router();

router.post("/customer/signup", customerSignup); 
router.get("/verify-email", verifyEmail); 
router.post("/login", login); 
router.post("/verify-otp", verifyOtp); 
router.get("/session", session); 
router.post("/logout", logout); 

// Forgot Password Routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Profile Routes (using requireAuth)
router.get("/me", requireAuth, getMe); 
router.put("/profile", requireAuth, updateProfile); 
router.delete("/delete-account", requireAuth, deleteAccount); 

// Online Status Routes
router.post("/heartbeat", requireAuth, heartbeat);
router.patch("/visibility", requireAuth, toggleVisibility);
router.get("/visibility", requireAuth, getVisibility);
router.post('/offline', requireAuth, setOffline); 

// ✅ PHASE 2 STAFF MANAGEMENT ROUTES (Admin/Staff Restricted)
router.post("/staff", requireAuth, createStaffAccount);
router.get("/staff", requireAuth, getAllStaff);
router.patch("/staff/:id", requireAuth, updateStaffStatus);
router.delete("/staff/:id", requireAuth, deleteStaffAccount);

export default router;