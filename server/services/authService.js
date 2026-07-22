// // FILE: server/services/authService.js
// // PURPOSE: All auth DB logic lives here — controller sirf req/res handle karta hai

// import crypto from "crypto";
// import bcrypt from "bcryptjs";
// import { Resend } from "resend";
// import User from "../models/User.js";
// import Inquiry from "../models/Inquiry.js";

// // ── In-memory OTP store for admin (no DB needed) ──────────────────────────────
// export const adminOtpStore = new Map();

// // ── Email sender (UPDATED TO RESEND)

// export const sendEmail = async ({ to, subject, html }) => {
//   if (!process.env.RESEND_API_KEY) {
//     console.warn("[email] RESEND_API_KEY not set — skipping.");
//     return false;
//   }

//   try {
//     const resend = new Resend(process.env.RESEND_API_KEY);

//     await resend.emails.send({
//       from:
//         process.env.RESEND_FROM_EMAIL || "Sanwariyas <onboarding@resend.dev>",
//       to,
//       subject,
//       html,
//     });
//     return true;
//   } catch (error) {
//     console.error("[email] Failed to send email via Resend:", error.message);
//     return false;
//   }
// };

// // ── Generate 6-digit OTP ──────────────────────────────────────────────────────
// export const generateOtp = () => String(crypto.randomInt(100000, 999999));

// const hashOtp = (otp) =>
//   crypto.createHash("sha256").update(String(otp)).digest("hex");
// const maskEmail = (email = "") => email.replace(/(.{2}).+(@.+)/, "$1***$2");

// export const signupCustomer = async ({
//   name,
//   email,
//   phone,
//   password,
//   company,
//   country,
// }) => {
//   // Validation
//   if (!name || !email || !phone || !password) {
//     const err = new Error("Name, email, phone and password are required.");
//     err.statusCode = 400;
//     throw err;
//   }
//   if (password.length < 8) {
//     const err = new Error("Password must be at least 8 characters.");
//     err.statusCode = 400;
//     throw err;
//   }

//   const cleanEmail = email.toLowerCase().trim();
//   const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();

//   // 1. ENV Admin Email Check
//   if (cleanEmail === adminEmail) {
//     const err = new Error("An account with this email already exists.");
//     err.statusCode = 403; // 403 Forbidden
//     throw err;
//   }

//   // 2. Database Duplicate check (using cleanEmail variable)
//   const existing = await User.findOne({ email: cleanEmail });
//   if (existing) {
//     const err = new Error("An account with this email already exists.");
//     err.statusCode = 409;
//     throw err;
//   }

//   // User model pre-save hook hashes password with bcrypt automatically
//   const user = await User.create({
//     name: name.trim(),
//     email: cleanEmail, // optimized here
//     phone: phone.trim(),
//     company: company?.trim() || "",
//     country: country?.trim() || "",
//     password,
//     role: "customer",
//     isVerified: true,
//   });

//   await sendEmail({
//     to: user.email,
//     subject: "Your SANWARIYAS account is ready",
//     html: `
//       <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #E8D5A3">
//         <p style="font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#C9A84C;margin:0 0 16px">Sanwariyas</p>
//         <h2 style="color:#574325;margin:0 0 8px">Welcome, ${user.name}!</h2>
//         <p style="color:#70543E;font-size:14px;margin:0 0 24px">Your account has been created. Sign in with your password and we will email you a one-time login code.</p>
//       </div>`,
//   });

//   return { email: user.email, name: user.name };
// };
// // ═══════════════════════════════════════════════════════
// // VERIFY EMAIL
// // ═══════════════════════════════════════════════════════
// export const verifyUserEmail = async (token) => {
//   if (!token) {
//     const err = new Error("Token is required.");
//     err.statusCode = 400;
//     throw err;
//   }

//   const user = await User.findOne({
//     verifyToken: token,
//     verifyExpiry: { $gt: new Date() },
//   });

//   if (!user) {
//     const err = new Error(
//       "Invalid or expired verification link. Please register again.",
//     );
//     err.statusCode = 400;
//     throw err;
//   }

//   user.isVerified = true;
//   user.verifyToken = null;
//   user.verifyExpiry = null;
//   await user.save();

//   return { email: user.email };
// };

// // ═══════════════════════════════════════════════════════
// // ADMIN LOGIN — generate OTP and send email
// // ═══════════════════════════════════════════════════════
// export const initiateAdminLogin = async (adminEmail) => {
//   const otp = generateOtp();

//   console.log("\n=============================================");
//   console.log(`🛡️  ADMIN LOGIN OTP FOR [${adminEmail}] IS: ${otp}`);
//   console.log("=============================================\n");

//   const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes
//   adminOtpStore.set(adminEmail, { otp, expiry });

//   const sent = await sendEmail({
//     to: adminEmail,
//     subject: "SANWARIYAS — Your Admin Login OTP",
//     html: `
//       <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #E8D5A3">
//         <p style="font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#C9A84C;margin:0 0 16px">Sanwariyas</p>
//         <h2 style="color:#574325;margin:0 0 8px">Admin Login OTP</h2>
//         <p style="color:#70543E;font-size:14px;margin:0 0 24px">Your one-time code expires in <strong>10 minutes</strong>.</p>
//         <div style="background:#f5efe4;border:1px solid #E8D5A3;padding:20px;text-align:center;margin-bottom:24px">
//           <span style="font-size:40px;font-weight:bold;letter-spacing:14px;color:#574325">${otp}</span>
//         </div>
//         <p style="color:#999;font-size:12px">If you did not request this, secure your account immediately.</p>
//       </div>`,
//   });

//   if (!sent) {
//     console.info(`[auth][dev] Admin OTP for ${adminEmail}: ${otp}`);
//   }

//   // Return masked email hint for frontend
//   return maskEmail(adminEmail);
// };

// // ═══════════════════════════════════════════════════════
// // CUSTOMER LOGIN — verify password and send OTP
// // ═══════════════════════════════════════════════════════
// export const loginCustomer = async (identifier, password) => {
//   const id = identifier.trim().toLowerCase();

//   const user = await User.findOne({
//     $or: [{ email: id }, { phone: identifier.trim() }],
//     role: "customer",
//     isActive: true,
//   });

//   // SECURITY FIX: Generic error for both "User Not Found" and "Wrong Password"
//   if (!user) {
//     const err = new Error(
//       "Invalid credentials. Please check your email/phone and password.",
//     );
//     err.statusCode = 401; // Unauthorized
//     throw err;
//   }

//   const passwordOk = await bcrypt.compare(password, user.password);

//   if (!passwordOk) {
//     const err = new Error(
//       "Invalid credentials. Please check your email/phone and password.",
//     );
//     err.statusCode = 401; // Unauthorized
//     throw err;
//   }

//   const otp = generateOtp();

//   console.log("\n=============================================");
//   console.log(`🚀 CUSTOMER LOGIN OTP FOR [${user.email}] IS: ${otp}`);
//   console.log("=============================================\n");

//   user.loginOtpHash = hashOtp(otp);
//   user.loginOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);
//   await user.save();

//   const sent = await sendEmail({
//     to: user.email,
//     subject: "SANWARIYAS - Your Login OTP",
//     html: `
//       <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #E8D5A3">
//         <p style="font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#C9A84C;margin:0 0 16px">Sanwariyas</p>
//         <h2 style="color:#574325;margin:0 0 8px">Customer Login OTP</h2>
//         <p style="color:#70543E;font-size:14px;margin:0 0 24px">Your one-time code expires in <strong>10 minutes</strong>.</p>
//         <div style="background:#f5efe4;border:1px solid #E8D5A3;padding:20px;text-align:center;margin-bottom:24px">
//           <span style="font-size:40px;font-weight:bold;letter-spacing:14px;color:#574325">${otp}</span>
//         </div>
//         <p style="color:#999;font-size:12px">If you did not request this, please ignore this email.</p>
//       </div>`,
//   });

//   if (!sent) {
//     console.info(`[auth][dev] Customer OTP for ${user.email}: ${otp}`);
//   }

//   // SECURITY FIX: explicit opt-in flag instead of relying on NODE_ENV,
//   // so devOtp can NEVER leak unless someone deliberately sets EXPOSE_DEV_OTP=true locally.
//   const devOtpAllowed = process.env.EXPOSE_DEV_OTP === "true";

//   return {
//     id: user._id.toString(),
//     email: user.email,
//     name: user.name,
//     role: user.role,
//     emailHint: maskEmail(user.email),
//     devOtp: !sent && devOtpAllowed ? otp : undefined,
//   };
// };

// export const verifyCustomerOtp = async (identifier, otp) => {
//   if (!identifier) {
//     const err = new Error("Email or phone is required to verify OTP.");
//     err.statusCode = 400;
//     throw err;
//   }

//   const id = identifier.trim().toLowerCase();
//   const user = await User.findOne({
//     $or: [{ email: id }, { phone: identifier.trim() }],
//     role: "customer",
//     isActive: true,
//   });

//   if (!user || !user.loginOtpHash) {
//     const err = new Error("No OTP requested. Please login again.");
//     err.statusCode = 400;
//     throw err;
//   }

//   // Check expiration
//   if (!user.loginOtpExpiry || new Date() > user.loginOtpExpiry) {
//     user.loginOtpHash = null;
//     user.loginOtpExpiry = null;
//     await user.save();
//     const err = new Error("OTP has expired. Please login again.");
//     err.statusCode = 400;
//     throw err;
//   }

//   // check otp Match
//   if (user.loginOtpHash !== hashOtp(otp.trim())) {
//     const err = new Error("Incorrect OTP. Please try again.");
//     err.statusCode = 400;
//     throw err;
//   }

//   // clear otp fields
//   user.loginOtpHash = null;
//   user.loginOtpExpiry = null;
//   user.isVerified = true;
//   await user.save();

//   try {
//     await Inquiry.updateMany(
//       { email: user.email, userId: null },
//       { userId: user._id },
//     );
//   } catch (linkError) {
//     console.error("Error linking guest inquiries:", linkError);
//   }

//   return {
//     id: user._id.toString(),
//     email: user.email,
//     name: user.name,
//     role: user.role,
//   };
// };

// // ═══════════════════════════════════════════════════════
// // VERIFY ADMIN OTP
// // ═══════════════════════════════════════════════════════
// export const verifyAdminOtp = (adminEmail, otp) => {
//   const stored = adminOtpStore.get(adminEmail);

//   if (!stored) {
//     const err = new Error("No OTP requested. Please login again.");
//     err.statusCode = 400;
//     throw err;
//   }
//   if (Date.now() > stored.expiry) {
//     adminOtpStore.delete(adminEmail);
//     const err = new Error("OTP has expired. Please login again.");
//     err.statusCode = 400;
//     throw err;
//   }
//   if (stored.otp !== otp.trim()) {
//     const err = new Error("Incorrect OTP. Please try again.");
//     err.statusCode = 400;
//     throw err;
//   }

//   adminOtpStore.delete(adminEmail);
//   return true;
// };

import crypto from "crypto";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import User from "../models/User.js";
import { safeCompare } from "../utils/authUtils.js";

// In-Memory Store for ENV-only Root Admins
export const adminOtpStore = new Map();

export const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY not set — skipping.");
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
    console.error("[email] Failed to send email via Resend:", error.message);
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

  const cleanEmail = email.toLowerCase().trim();
  const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();

  if (cleanEmail === adminEmail) {
    const err = new Error("An account with this email already exists.");
    err.statusCode = 403;
    throw err;
  }

  const existing = await User.findOne({ email: cleanEmail });
  if (existing) {
    const err = new Error("An account with this email already exists.");
    err.statusCode = 409;
    throw err;
  }

  const user = await User.create({
    name: name.trim(),
    email: cleanEmail,
    phone: phone.trim(),
    company: company?.trim() || "",
    country: country?.trim() || "",
    password,
    role: "customer",
    isVerified: true,
  });

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
  const id = identifier.trim().toLowerCase();
  const user = await User.findOne({
    $or: [{ email: id }, { phone: identifier.trim() }],
    isActive: true,
  });

  if (!user) {
    const err = new Error("Invalid credentials. Please check your details.");
    err.statusCode = 401;
    throw err;
  }

  const passwordOk = await bcrypt.compare(password, user.password);
  if (!passwordOk) {
    const err = new Error("Invalid credentials. Please check your details.");
    err.statusCode = 401;
    throw err;
  }

  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
  };
};

// ═════════════════════════════════════════════════════════════════
// FORGOT PASSWORD FLOW
// ═════════════════════════════════════════════════════════════════

export const initiateForgotPassword = async (identifier) => {
  const id = identifier.trim().toLowerCase();
  const user = await User.findOne({
    $or: [{ email: id }, { phone: identifier.trim() }],
    isActive: true,
  });

  const genericResponse = {
    emailHint: null,
    message: "If an account exists, a reset code has been sent.",
  };

  if (!user) return genericResponse; // ← don't reveal admin-vs-missing distinction, don't throw 404

  const otp = generateOtp();
  console.log(`\n🔑 PASSWORD RESET OTP FOR [${user.email}] IS: ${otp}\n`); // ✅ terminal mein print

  user.resetOtpHash = hashOtp(otp);
  user.resetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  const sent = await sendEmail({
    to: user.email, // ✅ Resend ke through hamesha MAIL pe jayega (phone se login/lookup hone par bhi)
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

  if (!sent) console.info(`[auth][dev] Reset OTP for ${user.email}: ${otp}`); // ✅ agar mail fail ho toh bhi terminal se pata chal jaye

  return { emailHint: maskEmail(user.email), message: genericResponse.message };
};

export const resetUserPassword = async (email, otp, newPassword) => {
  const user = await User.findOne({ email });

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
