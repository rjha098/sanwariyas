// FILE: server/controllers/authController.js
// PURPOSE: Handles HTTP req/res — business logic is in authService

// 1. All imports must be at the top
import { createAuthToken, safeCompare, verifyAuthToken } from '../utils/authUtils.js';
import * as authService from '../services/authService.js';
import User from '../models/User.js'; // Imported for profile updating and fetching
import Inquiry from '../models/Inquiry.js'; // Imported to cascade delete inquiries

// ═══════════════════════════════════════════════════════
// CUSTOMER SIGNUP
// POST /api/auth/customer/signup
// Body: { name, email, phone, password, company?, country? }
// ═══════════════════════════════════════════════════════
export const customerSignup = async (req, res) => {
  try {
    await authService.signupCustomer(req.body);
    return res.status(201).json({
      success: true,
      message: 'Account created! Sign in to receive your email OTP.',
    });
  } catch (error) {
    console.error('[auth/customer/signup]', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server error during signup.',
    });
  }
};

// ═══════════════════════════════════════════════════════
// VERIFY EMAIL
// GET /api/auth/verify-email?token=xxx
// ═══════════════════════════════════════════════════════
export const verifyEmail = async (req, res) => {
  try {
    await authService.verifyUserEmail(req.query.token);
    return res.json({ success: true, message: 'Email verified! You can now log in.' });
  } catch (error) {
    console.error('[auth/verify-email]', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server error.',
    });
  }
};

// ═══════════════════════════════════════════════════════
// LOGIN — Step 1: verify credentials → send OTP or issue token
// POST /api/auth/login
// Body: { identifier, password }
// ═══════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════
// LOGIN — Step 1: verify credentials → send OTP or issue token
// POST /api/auth/login
// Body: { identifier, password }
// ═══════════════════════════════════════════════════════
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email/phone and password are required.',
      });
    }

    const adminUsername = (process.env.ADMIN_USERNAME || 'admin').trim();
    const adminEmail    = (process.env.ADMIN_EMAIL    || '').trim().toLowerCase();
    const adminPassword = (process.env.ADMIN_PASSWORD || '').trim();
    const id            = identifier.trim().toLowerCase();

    // ── Admin check ───────────────────────────────────────────
    const isAdminId = safeCompare(id, adminUsername.toLowerCase()) ||
                      safeCompare(id, adminEmail);

    if (isAdminId) {
      if (safeCompare(password.trim(), adminPassword)) {
        const emailHint = await authService.initiateAdminLogin(adminEmail);
        return res.json({ success: true, requires2FA: true, role: 'admin', emailHint });
      } else {
        return res.status(401).json({ success: false, message: 'Incorrect admin password.' });
      }
    }

    // ── Customer check for "Account Not Found" ────────────────
    // First, check if the user actually exists in the database
    const userExists = await User.findOne({
      $or: [{ email: id }, { phone: identifier.trim() }]
    });

    // If the user is not found, return a clear, specific message
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: 'Account not found. Please create a new account.',
      });
    }

    // ── Proceed with actual login (Password verification) ──────
    const customer = await authService.loginCustomer(identifier, password);

    if (customer) {
      return res.json({
        success: true,
        requires2FA: true,
        role: 'customer',
        emailHint: customer.emailHint,
        devOtp: customer.devOtp,
      });
    }

    // If userExists is true but customer is null, the password must be wrong
    return res.status(401).json({
      success: false,
      message: 'Incorrect password. Please try again.',
    });
  } catch (error) {
    console.error('[auth/login]', error);
    // If the authService throws a specific error, it will be caught here
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server error during login.',
    });
  }
};

// ═══════════════════════════════════════════════════════
// VERIFY OTP — Step 2 (Admin only)
// POST /api/auth/verify-otp
// Body: { otp, role, identifier? }
// ═══════════════════════════════════════════════════════
export const verifyOtp = async (req, res) => {
  try {
    const { otp, role, identifier } = req.body;

    if (!otp || !role) {
      return res.status(400).json({ success: false, message: 'OTP and role are required.' });
    }

    if (role === 'admin') {
      const adminEmail    = (process.env.ADMIN_EMAIL    || '').trim().toLowerCase();
      const adminUsername = (process.env.ADMIN_USERNAME || 'admin').trim();

      authService.verifyAdminOtp(adminEmail, otp); // throws on failure

      const token = createAuthToken({ role: 'admin', username: adminUsername, email: adminEmail });
      return res.json({
        success: true,
        token,
        user: { username: adminUsername, email: adminEmail, role: 'admin' },
      });
    }

    if (role === 'customer') {
      const customer = await authService.verifyCustomerOtp(identifier, otp);
      const token = createAuthToken({
        role: 'customer',
        id: customer.id,
        email: customer.email,
        name: customer.name,
      });

      return res.json({
        success: true,
        token,
        user: { id: customer.id, name: customer.name, email: customer.email, role: 'customer' },
      });
    }

    return res.status(400).json({ success: false, message: 'Invalid role.' });
  } catch (error) {
    console.error('[auth/verify-otp]', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server error.',
    });
  }
};

// ═══════════════════════════════════════════════════════
// SESSION CHECK
// GET /api/auth/session  (Authorization: Bearer <token>)
// ═══════════════════════════════════════════════════════
export const session = async (req, res) => {
  try {
    const header = req.headers.authorization || '';
    const token  = header.startsWith('Bearer ') ? header.slice(7) : null;
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const payload = verifyAuthToken(token);

    // SECURITY FIX: Verify if the user still exists in the database
    // This blocks "Zombie sessions" if the account was deleted
    if (payload.role === 'customer') {
      const userExists = await User.findById(payload.id);
      if (!userExists) {
        return res.status(401).json({ success: false, message: 'Account no longer exists.' });
      }
    }

    const freshToken = createAuthToken({
      role:     payload.role,
      username: payload.username,
      email:    payload.email,
      id:       payload.id,
      name:     payload.name,
    });

    return res.json({
      success: true,
      token: freshToken,
      user: {
        username: payload.username,
        name:     payload.name,
        email:    payload.email,
        role:     payload.role,
        id:       payload.id,
      },
    });
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired session.' });
  }
};

// ═══════════════════════════════════════════════════════
// GET CURRENT USER PROFILE (ME)
// GET /api/auth/me
// ═══════════════════════════════════════════════════════
export const getMe = async (req, res) => {
  try {
    const userId = req.authUser.id;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ═══════════════════════════════════════════════════════
// UPDATE USER PROFILE
// PUT /api/auth/profile
// ═══════════════════════════════════════════════════════
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, company, country } = req.body;
    
    const userId = req.authUser.id; 
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.company = company || user.company;
    user.country = country || user.country;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        company: user.company,
        country: user.country
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ═══════════════════════════════════════════════════════
// LOGOUT
// POST /api/auth/logout
// ═══════════════════════════════════════════════════════
export const logout = (_req, res) => res.json({ success: true, message: 'Logged out.' });

// ═══════════════════════════════════════════════════════
// DELETE ACCOUNT (RIGHT TO BE FORGOTTEN)
// DELETE /api/auth/delete-account
// ═══════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════
// DELETE ACCOUNT (RIGHT TO BE FORGOTTEN)
// DELETE /api/auth/delete-account
// ═══════════════════════════════════════════════════════
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.authUser.id;

    // 1. Ensure user exists before trying to delete
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // 2. Cascade Delete FIX: Delete inquiries matching the userId OR the user's email
    // This catches guest inquiries made before they created an account
    await Inquiry.deleteMany({
      $or: [
        { userId: userId },
        { email: user.email }
      ]
    });

    // 3. Delete the user profile
    await User.findByIdAndDelete(userId);

    return res.json({ 
      success: true, 
      message: 'Account and all associated data deleted permanently.' 
    });
  } catch (error) {
    console.error('[auth/delete-account]', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to delete account. Please try again later.' 
    });
  }
};