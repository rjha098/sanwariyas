// FILE: server/controllers/authController.js
// PURPOSE: Sirf HTTP req/res handle karta hai — sab logic authService mein hai

import { createAuthToken, safeCompare, verifyAuthToken } from '../utils/authUtils.js';
import * as authService from '../services/authService.js';

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
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email/username and password are required.',
      });
    }

    const adminUsername = (process.env.ADMIN_USERNAME || 'admin').trim();
    const adminEmail    = (process.env.ADMIN_EMAIL    || '').trim().toLowerCase();
    const adminPassword = (process.env.ADMIN_PASSWORD || '').trim();
    const id            = identifier.trim().toLowerCase();

    // ── Admin check ───────────────────────────────────────────
    const isAdminId = safeCompare(id, adminUsername.toLowerCase()) ||
                      safeCompare(id, adminEmail);

    if (isAdminId && safeCompare(password.trim(), adminPassword)) {
      const emailHint = await authService.initiateAdminLogin(adminEmail);
      return res.json({ success: true, requires2FA: true, role: 'admin', emailHint });
    }

    // ── Customer check ────────────────────────────────────────
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

    return res.status(401).json({
      success: false,
      message: 'Invalid credentials. Please try again.',
    });
  } catch (error) {
    console.error('[auth/login]', error);
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
export const session = (req, res) => {
  try {
    const header = req.headers.authorization || '';
    const token  = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const payload    = verifyAuthToken(token);
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
// LOGOUT
// POST /api/auth/logout
// ═══════════════════════════════════════════════════════
export const logout = (_req, res) => res.json({ success: true, message: 'Logged out.' });
