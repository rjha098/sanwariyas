// FILE: server/services/authService.js
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import User from "../models/User.js";
import Inquiry from "../models/Inquiry.js";
import { safeCompare } from "../utils/authUtils.js";
import {
  normalizeEmail,
  normalizePhone,
  phoneMatchCandidates,
} from "../utils/normalize.js";

// In-Memory Store for ENV-only Root Admins
export const adminOtpStore = new Map();

export const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.RESEND_API_KEY) {
    // console.warn("[email] RESEND_API_KEY not set — skipping.");
    return false;
  }
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from:
        process.env.RESEND_FROM_EMAIL || "Sanwariyas <onboarding@resend.dev>",
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    // console.error("[email] Failed to send email via Resend:", error.message);
    return false;
  }
};

export const generateOtp = () => String(crypto.randomInt(100000, 999999));

const hashOtp = (otp) =>
  crypto.createHash("sha256").update(String(otp)).digest("hex");

export const maskEmail = (email = "") =>
  email.replace(/(.{2}).+(@.+)/, "$1***$2");

export const signupCustomer = async ({
  name,
  email,
  phone,
  countryCode,
  password,
  company,
  country,
}) => {
  if (!name || !email || !phone || !password) {
    const err = new Error("Name, email, phone and password are required.");
    err.statusCode = 400;
    throw err;
  }
  if (password.length < 8) {
    const err = new Error("Password must be at least 8 characters.");
    err.statusCode = 400;
    throw err;
  }

  const cleanEmail = normalizeEmail(email);
  const cleanPhone = normalizePhone(phone);
  const adminEmail = normalizeEmail(process.env.ADMIN_EMAIL || "");

  if (cleanEmail === adminEmail) {
    const err = new Error("An account with this email already exists.");
    err.statusCode = 403;
    throw err;
  }

  // Check email and phone together so we can give a precise error message,
  // and so that "same email + same phone" always resolves to a single
  // account no matter which field a future login uses.
  const existing = await User.findOne({
    $or: [{ email: cleanEmail }, { phone: cleanPhone }],
  });

  if (existing) {
    if (existing.email === cleanEmail) {
      const err = new Error("An account with this email already exists.");
      err.statusCode = 409;
      throw err;
    }

    const err = new Error("An account with this phone number already exists.");
    err.statusCode = 409;
    throw err;
  }

  const user = await User.create({
    name: name.trim(),
    email: cleanEmail,
    phone: cleanPhone,
    countryCode: (countryCode || "91").trim(),
    company: company?.trim() || "",
    country: country?.trim() || "",
    password,
    role: "customer",
    isVerified: true,
  });


  // Link any guest inquiries (submitted before this account existed) that
  // match BOTH this exact email AND this exact phone number — a partial
  // match (only one of the two) is intentionally NOT linked, so an inquiry
  // never becomes visible to the wrong account just because one field
  // happens to be reused.

  
  await Inquiry.updateMany(
    {
      userId: null,
      email: cleanEmail,
      whatsapp: cleanPhone,
    },
    { userId: user._id },
  ).catch(() => {});

  await sendEmail({
    to: user.email,
    subject: "Your SANWARIYAS account is ready",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #E8D5A3">
        <p style="font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#C9A84C;margin:0 0 16px">Sanwariyas</p>
        <h2 style="color:#574325;margin:0 0 8px">Welcome, ${user.name}!</h2>
        <p style="color:#70543E;font-size:14px;margin:0 0 24px">Your account has been created. Sign in using your email and password to access your dashboard.</p>
      </div>`,
  });

  return { email: user.email, name: user.name };
};

export const verifyUserEmail = async (token) => {
  if (!token) {
    const err = new Error("Token is required.");
    err.statusCode = 400;
    throw err;
  }

  const user = await User.findOne({
    verifyToken: token,
    verifyExpiry: { $gt: new Date() },
  });

  if (!user) {
    const err = new Error(
      "Invalid or expired verification link. Please register again.",
    );
    err.statusCode = 400;
    throw err;
  }

  user.isVerified = true;
  user.verifyToken = null;
  user.verifyExpiry = null;
  await user.save();

  return { email: user.email };
};

// ═════════════════════════════════════════════════════════════════
// HYBRID ADMIN LOGIN (DB + FALLBACK TO MAP)
// ═════════════════════════════════════════════════════════════════

export const initiateAdminLogin = async (adminEmail) => {
  const otp = generateOtp();
  console.log(`\n🛡️  ADMIN LOGIN OTP FOR [${adminEmail}] IS: ${otp}\n`);

  const user = await User.findOne({ email: adminEmail });

  if (user) {
    // 1. Distributed DB OTP (For Staff and DB Admins)
    user.adminOtpHash = hashOtp(otp);
    user.adminOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
  } else {
    // 2. Memory Fallback (For purely ENV-based Admins)
    const expiry = Date.now() + 10 * 60 * 1000;
    adminOtpStore.set(adminEmail, { hash: hashOtp(otp), expiry });
  }

  const sent = await sendEmail({
    to: adminEmail,
    subject: "SANWARIYAS — Your Admin Login OTP",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #E8D5A3">
        <h2 style="color:#574325;margin:0 0 8px">Admin Login OTP</h2>
        <p style="color:#70543E;font-size:14px;margin:0 0 24px">Your one-time code expires in <strong>10 minutes</strong>.</p>
        <div style="background:#f5efe4;border:1px solid #E8D5A3;padding:20px;text-align:center;margin-bottom:24px">
          <span style="font-size:40px;font-weight:bold;letter-spacing:14px;color:#574325">${otp}</span>
        </div>
      </div>`,
  });

  if (!sent) console.info(`[auth][dev] Admin OTP for ${adminEmail}: ${otp}`);

  return maskEmail(adminEmail);
};

export const verifyAdminOtp = async (adminEmail, otp) => {
  const user = await User.findOne({ email: adminEmail });

  if (user) {
    // 1. Verify Distributed DB OTP with Strict Constant-Time Equality Check
    if (
      !user.adminOtpHash ||
      !safeCompare(user.adminOtpHash, hashOtp(otp.trim()))
    ) {
      const err = new Error("Incorrect OTP. Please try again.");
      err.statusCode = 400;
      throw err;
    }
    if (Date.now() > user.adminOtpExpiry) {
      user.adminOtpHash = null;
      user.adminOtpExpiry = null;
      await user.save();
      const err = new Error("OTP has expired. Please login again.");
      err.statusCode = 400;
      throw err;
    }
    user.adminOtpHash = null;
    user.adminOtpExpiry = null;
    await user.save();
    return true;
  }

  // 2. Verify Memory Fallback OTP (For purely ENV-based Admins)
  const stored = adminOtpStore.get(adminEmail);
  if (!stored) {
    const err = new Error("No OTP requested. Please login again.");
    err.statusCode = 400;
    throw err;
  }
  if (!safeCompare(stored.hash, hashOtp(otp.trim()))) {
    const err = new Error("Incorrect OTP. Please try again.");
    err.statusCode = 400;
    throw err;
  }
  if (Date.now() > stored.expiry) {
    adminOtpStore.delete(adminEmail);
    const err = new Error("OTP has expired. Please login again.");
    err.statusCode = 400;
    throw err;
  }

  adminOtpStore.delete(adminEmail);
  return true;
};

// ═════════════════════════════════════════════════════════════════
// DIRECT LOGIN VALIDATION
// ═════════════════════════════════════════════════════════════════

export const loginUser = async (identifier, password) => {
  const cleanEmail = normalizeEmail(identifier);
  const phoneCandidates = phoneMatchCandidates(identifier);
  const typedDigits = normalizePhone(identifier);

  // Phone is unique going forward, but old accounts created before that
  // constraint existed can still collide. So instead of trusting the first
  // match, fetch every account this identifier could belong to (across
  // every plausible phone form — with/without country code) and check the
  // password against each — this way login works correctly even with
  // legacy data, with no manual DB cleanup required.
  //
  // phoneCandidates only guesses India's "91" dial code. For any other
  // country, a bare local number (e.g. a US or UAE user typing just their
  // number without re-entering the country code) would never match the
  // stored "<dialcode><localnumber>" value. To cover every country without
  // hardcoding every dial code, we ALSO match any stored phone that simply
  // ENDS WITH the digits the person typed — this is safe because
  // typedDigits is already digit-only (regex-safe) and short local numbers
  // (<6 digits) are excluded to avoid overly broad matches.

  const phoneOrConditions = [{ phone: { $in: phoneCandidates } }];
  if (typedDigits.length >= 6) {
    phoneOrConditions.push({ phone: { $regex: `${typedDigits}$` } });
  }

  const candidates = await User.find({
    $or: [{ email: cleanEmail }, ...phoneOrConditions],
    isActive: true,
  });

  const DUMMY_HASH =
    "$2a$12$CwTycUXWue0Thq9StjUM0uJ8G8j6xQZQ0Zz9Z9Z9Z9Z9Z9Z9Z9Z9";

  if (candidates.length === 0) {
    await bcrypt.compare(password, DUMMY_HASH); // Fake password check time burn karne ke liye
    const err = new Error(
      "Account not found. Please check your email or sign up.",
    );
    err.statusCode = 401;
    throw err;
  }

  let user = null;
  for (const candidate of candidates) {
    const passwordOk = await bcrypt.compare(password, candidate.password);
    if (passwordOk) {
      user = candidate;
      break;
    }
  }

  if (!user) {
    const err = new Error("Invalid credentials. Please check your details.");
    err.statusCode = 401;
    throw err;
  }

  return {
    id: user._id.toString(),
    email: user.email,
    phone: user.phone,
    name: user.name,
    role: user.role,
  };
};

// ═════════════════════════════════════════════════════════════════
// FORGOT PASSWORD FLOW
// ═════════════════════════════════════════════════════════════════

export const initiateForgotPassword = async (identifier) => {
  const cleanEmail = normalizeEmail(identifier);
  const phoneCandidates = phoneMatchCandidates(identifier);

  // Same duplicate-phone safety as loginUser: don't just trust the first
  // match — if a phone collides across old accounts, prefer the one whose
  // email actually matches (a phone-only match is ambiguous here since
  // there's no password to disambiguate with).
  const candidates = await User.find({
    $or: [{ email: cleanEmail }, { phone: { $in: phoneCandidates } }],
    isActive: true,
  });

  if (candidates.length === 0) {
    const err = new Error("Account not found. Cannot reset password.");
    err.statusCode = 404;
    throw err;
  }

  const user = candidates.find((c) => c.email === cleanEmail) || candidates[0];

  const otp = generateOtp();
  console.log(`\n🔑 PASSWORD RESET OTP FOR [${user.email}] IS: ${otp}\n`);

  user.resetOtpHash = hashOtp(otp);
  user.resetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  const sent = await sendEmail({
    to: user.email,
    subject: "SANWARIYAS — Password Reset OTP",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #E8D5A3">
        <p style="font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#C9A84C;margin:0 0 16px">Sanwariyas</p>
        <h2 style="color:#574325;margin:0 0 8px">Password Reset OTP</h2>
        <p style="color:#70543E;font-size:14px;margin:0 0 24px">Your one-time code expires in <strong>10 minutes</strong>.</p>
        <div style="background:#f5efe4;border:1px solid #E8D5A3;padding:20px;text-align:center;margin-bottom:24px">
          <span style="font-size:40px;font-weight:bold;letter-spacing:14px;color:#574325">${otp}</span>
        </div>
        <p style="color:#999;font-size:12px">If you did not request this, please ignore this email.</p>
      </div>`,
  });

  if (!sent) console.info(`[auth][dev] Reset OTP for ${user.email}: ${otp}`);

  return {
    emailHint: maskEmail(user.email),
    message: "Reset code has been sent.",
  };
};

export const resetUserPassword = async (email, otp, newPassword) => {
  const cleanEmail = normalizeEmail(email);
  const user = await User.findOne({ email: cleanEmail });

  if (
    !user ||
    !user.resetOtpHash ||
    !safeCompare(user.resetOtpHash, hashOtp(otp.trim()))
  ) {
    const err = new Error("Invalid or expired OTP.");
    err.statusCode = 400;
    throw err;
  }

  if (new Date() > user.resetOtpExpiry) {
    const err = new Error("OTP has expired. Please request a new one.");
    err.statusCode = 400;
    throw err;
  }

  if (newPassword.length < 8) {
    const err = new Error("Password must be at least 8 characters.");
    err.statusCode = 400;
    throw err;
  }

  user.password = newPassword;
  user.resetOtpHash = null;
  user.resetOtpExpiry = null;
  await user.save();

  return true;
};
