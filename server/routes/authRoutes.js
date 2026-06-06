// FILE: server/routes/authRoutes.js
import express from 'express';
import { login, verifyOtp, session, logout } from '../controllers/authController.js';

const router = express.Router();

router.post('/login',      login);       // Step 1 — credentials
router.post('/verify-otp', verifyOtp);   // Step 2 — OTP
router.get('/session',     session);     // Session restore
router.post('/logout',     logout);      // Logout

export default router;