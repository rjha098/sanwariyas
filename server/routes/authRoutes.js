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
} from "../controllers/authController.js";

import { requireAuth } from "../utils/authUtils.js";

const router = express.Router();

router.post("/customer/signup", customerSignup); // Customer registration
router.get("/verify-email", verifyEmail); // Email verification
router.post("/login", login); // Step 1 — credentials
router.post("/verify-otp", verifyOtp); // Step 2 — OTP (admin)
router.get("/session", session); // Session restore
router.post("/logout", logout); // Logout

//  Profile Routes (using requireAuth)
router.get("/me", requireAuth, getMe); // Fetch profile data
router.put("/profile", requireAuth, updateProfile); // Update profile
router.delete("/delete-account", requireAuth, deleteAccount); // Delete account & data

// ✅ FIX: Online Status Routes
router.post("/heartbeat", requireAuth, heartbeat);
router.patch("/visibility", requireAuth, toggleVisibility);
router.get("/visibility", requireAuth, getVisibility);
router.post('/offline', requireAuth, setOffline); 
export default router;
