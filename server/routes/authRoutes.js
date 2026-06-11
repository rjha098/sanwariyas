// FILE: server/routes/authRoutes.js
import express from 'express';
import {
  login,
  verifyOtp,
  session,
  logout,
  customerSignup,
  verifyEmail,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/customer/signup', customerSignup); // Customer registration
router.get('/verify-email',     verifyEmail);     // Email verification
router.post('/login',           login);           // Step 1 — credentials
router.post('/verify-otp',      verifyOtp);       // Step 2 — OTP (admin)
router.get('/session',          session);         // Session restore
router.post('/logout',          logout);          // Logout

export default router;