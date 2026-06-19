// // FILE: server/routes/authRoutes.js
// import express from 'express';
// import {
//   login,
//   verifyOtp,
//   session,
//   logout,
//   customerSignup,
//   verifyEmail,
//   updateProfile,
//   getMe
// } from '../controllers/authController.js';

// // ✅ Imported the correct function from the correct utilities folder
// import { requireAuth } from '../utils/authUtils.js'; 

// const router = express.Router();

// router.post('/customer/signup', customerSignup); // Customer registration
// router.get('/verify-email',     verifyEmail);    // Email verification
// router.post('/login',           login);          // Step 1 — credentials
// router.post('/verify-otp',      verifyOtp);      // Step 2 — OTP (admin)
// router.get('/session',          session);        // Session restore
// router.post('/logout',          logout);         // Logout

// // ✅ Profile Routes (using requireAuth)
// router.get('/me', requireAuth, getMe);                // Fetch profile data
// router.put('/profile', requireAuth, updateProfile);   // Update profile

// export default router;


// FILE: server/routes/authRoutes.js
import express from 'express';
import {
  login,
  verifyOtp,
  session,
  logout,
  customerSignup,
  verifyEmail,
  updateProfile,
  getMe,
  deleteAccount // ✅ Imported new controller method
} from '../controllers/authController.js';

// ✅ Imported the correct function from the correct utilities folder
import { requireAuth } from '../utils/authUtils.js'; 

const router = express.Router();

router.post('/customer/signup', customerSignup); // Customer registration
router.get('/verify-email',     verifyEmail);    // Email verification
router.post('/login',           login);          // Step 1 — credentials
router.post('/verify-otp',      verifyOtp);      // Step 2 — OTP (admin)
router.get('/session',          session);        // Session restore
router.post('/logout',          logout);         // Logout

// ✅ Profile Routes (using requireAuth)
router.get('/me', requireAuth, getMe);                // Fetch profile data
router.put('/profile', requireAuth, updateProfile);   // Update profile
router.delete('/delete-account', requireAuth, deleteAccount); // ✅ Delete account & data

export default router;