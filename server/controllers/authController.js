// FILE: server/controllers/authController.js
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { createAuthToken, safeCompare, verifyAuthToken } from '../utils/authUtils.js';

// In-memory OTP store for admin (no DB needed)
const adminOtpStore = new Map();

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('[2FA] EMAIL_USER / EMAIL_PASS not set — cannot send OTP.');
    return;
  }
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  await transporter.sendMail({
    from: `"SANWARIYAS" <${process.env.EMAIL_USER}>`,
    to, subject, html,
  });
};

// ═══════════════════════════════════════════════════════
// LOGIN — Step 1: verify credentials → send OTP
// POST /api/auth/login
// Body: { identifier, password }
// ═══════════════════════════════════════════════════════
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Email/username and password are required.' });
    }

    const adminUsername = (process.env.ADMIN_USERNAME || 'admin').trim();
    const adminEmail    = (process.env.ADMIN_EMAIL    || '').trim().toLowerCase();
    const adminPassword = (process.env.ADMIN_PASSWORD || '').trim();

    if (!adminPassword) {
      return res.status(500).json({ success: false, message: 'Server not configured. Contact support.' });
    }

    const id = identifier.trim().toLowerCase();
    const isAdminId = safeCompare(id, adminUsername.toLowerCase()) || safeCompare(id, adminEmail);

    if (isAdminId && safeCompare(password.trim(), adminPassword)) {
      // ✅ Credentials correct — generate & send OTP
      const otp    = String(crypto.randomInt(100000, 999999));
      const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes
      adminOtpStore.set(adminEmail, { otp, expiry });

      await sendEmail({
        to: adminEmail,
        subject: 'SANWARIYAS — Your Admin Login OTP',
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #E8D5A3">
            <p style="font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#C9A84C;margin:0 0 16px">Sanwariyas</p>
            <h2 style="color:#574325;margin:0 0 8px">Admin Login OTP</h2>
            <p style="color:#70543E;font-size:14px;margin:0 0 24px">
              Your one-time code expires in <strong>10 minutes</strong>.
            </p>
            <div style="background:#f5efe4;border:1px solid #E8D5A3;padding:20px;text-align:center;margin-bottom:24px">
              <span style="font-size:40px;font-weight:bold;letter-spacing:14px;color:#574325">${otp}</span>
            </div>
            <p style="color:#999;font-size:12px">If you did not request this, please secure your account immediately.</p>
          </div>`,
      });

      // Return masked email hint to frontend
      const emailHint = adminEmail.replace(/(.{2}).+(@.+)/, '$1***$2');
      return res.json({ success: true, requires2FA: true, role: 'admin', emailHint });
    }

    return res.status(401).json({ success: false, message: 'Invalid credentials. Please try again.' });
  } catch (error) {
    console.error('[auth/login]', error);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

// ═══════════════════════════════════════════════════════
// VERIFY OTP — Step 2: verify OTP → issue token
// POST /api/auth/verify-otp
// Body: { otp, role }
// ═══════════════════════════════════════════════════════
export const verifyOtp = async (req, res) => {
  try {
    const { otp, role } = req.body;
    if (!otp || !role) {
      return res.status(400).json({ success: false, message: 'OTP and role are required.' });
    }

    if (role === 'admin') {
      const adminEmail    = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
      const adminUsername = (process.env.ADMIN_USERNAME || 'admin').trim();
      const stored        = adminOtpStore.get(adminEmail);

      if (!stored) {
        return res.status(400).json({ success: false, message: 'No OTP requested. Please login again.' });
      }
      if (Date.now() > stored.expiry) {
        adminOtpStore.delete(adminEmail);
        return res.status(400).json({ success: false, message: 'OTP has expired. Please login again.' });
      }
      if (!safeCompare(otp.trim(), stored.otp)) {
        return res.status(400).json({ success: false, message: 'Incorrect OTP. Please try again.' });
      }

      // ✅ OTP correct — clear it and issue JWT
      adminOtpStore.delete(adminEmail);
      const token = createAuthToken({ role: 'admin', username: adminUsername, email: adminEmail });

      return res.json({
        success: true,
        token,
        user: { username: adminUsername, email: adminEmail, role: 'admin' },
      });
    }

    return res.status(400).json({ success: false, message: 'Invalid role.' });
  } catch (error) {
    console.error('[auth/verify-otp]', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ═══════════════════════════════════════════════════════
// SESSION CHECK — restore session on page reload
// GET /api/auth/session  (Authorization: Bearer <token>)
// ═══════════════════════════════════════════════════════
export const session = (req, res) => {
  try {
    const header = req.headers.authorization || '';
    const token  = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ success: false, message: 'Authentication required.' });

    const payload = verifyAuthToken(token);
    // Issue a fresh token to extend session
    const freshToken = createAuthToken({
      role:     payload.role,
      username: payload.username,
      email:    payload.email,
      id:       payload.id,
    });

    return res.json({
      success: true,
      token: freshToken,
      user: { username: payload.username, email: payload.email, role: payload.role, id: payload.id },
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