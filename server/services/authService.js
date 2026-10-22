// FILE: server/services/authService.js

//usage---->>>> controllers/authController.js & services/authService.js: Handles the heavy lifting of user identity. It processes customer signups, issues HTTP-only cookies, triggers Resend OTP emails for staff/admin 2FA, and seamlessly merges old "guest" inquiries into new accounts based on matching phone/email data.

import crypto from "crypto";
import {
  guardKey,
  assertNotLocked,
  claimSend,
  countAttempt,
  failAttempt,
  clearAttempts,
  guardStatus,
} from "../utils/otpGuard.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import User from "../models/User.js";
import Inquiry from "../models/Inquiry.js";
import { safeCompare } from "../utils/authUtils.js";
import {
  validatePassword,
  validateConfirmPassword,
  validateName,
  validatePhone,
  validateCompany,
  validateCountry,
  validateCountryMatchesDial,
} from "../utils/validators.js";
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

    const { error } = await resend.emails.send({
      from:
        process.env.RESEND_FROM_EMAIL || "Sanwariyas <onboarding@resend.dev>",
      to,
      subject,
      html,
    });
    if (error) {
      console.error(
        "[email] Resend rejected the email:",
        error.message || error,
      );
      return false;
    }
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

  if (isReservedAdminEmail(cleanEmail)) {
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

  // NOTE: guest inquiries are NOT linked here. Linking by matching email/phone
  // would let anyone who registers with someone else's contact details see
  // that person's inquiries. Inquiries are claimed only after the owner proves
  // access to the inquiry email with a one-time code (inquiryClaimService).

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

// The old hard-coded dummy was 59 chars (a valid bcrypt hash is 60), so
// bcrypt.compare returned instantly and "unknown account" was measurably
// faster than "wrong password". A real hash (same cost factor 12) keeps both
// paths equally slow. Computed once at startup.
const DUMMY_HASH = bcrypt.hashSync("sanwariyas-dummy-password", 12);

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

  // An identifier containing "@" is an EMAIL and is matched against the
  // current `email` field only. It must never fall through to phone-digit
  // matching (digits inside an email would otherwise be tried as a phone).
  const isEmailIdentifier = String(identifier).includes("@");
  const phoneOrConditions = [];
  if (!isEmailIdentifier) {
    phoneOrConditions.push({ phone: { $in: phoneCandidates } });
    if (typedDigits.length >= 6) {
      phoneOrConditions.push({ phone: { $regex: `${typedDigits}$` } });
    }
  }

  const candidates = await User.find({
    $or: isEmailIdentifier
      ? [{ email: cleanEmail }]
      : [{ email: cleanEmail }, ...phoneOrConditions],
    isActive: true,
  });

  // const DUMMY_HASH =
  //   "$2a$12$CwTycUXWue0Thq9StjUM0uJ8G8j6xQZQ0Zz9Z9Z9Z9Z9Z9Z9Z9Z9";

  // if (candidates.length === 0) {
  //   await bcrypt.compare(password, DUMMY_HASH); // Fake password check time burn karne ke liye
  //   const err = new Error(
  //     "Account not found. Please check your email or sign up.",
  //   );
  //   err.statusCode = 401;
  //   throw err;
  // }

  // let user = null;
  // for (const candidate of candidates) {
  //   const passwordOk = await bcrypt.compare(password, candidate.password);
  //   if (passwordOk) {
  //     user = candidate;
  //     break;
  //   }
  // }

  // if (!user) {
  //   const err = new Error("Invalid credentials. Please check your details.");
  //   err.statusCode = 401;
  //   throw err;
  // }

  // (DUMMY_HASH is a valid bcrypt hash defined at module level below.)

  // SECURITY: use the exact same message + statusCode as the "wrong
  // password" branch below (account enumeration fix). The DUMMY_HASH
  // compare above is untouched — it's what keeps this branch's timing
  // indistinguishable from a real password check.
  const INVALID_CREDENTIALS_MESSAGE =
    "Invalid credentials. Please check your details.";

  if (candidates.length === 0) {
    await bcrypt.compare(password, DUMMY_HASH); // Fake password check time burn karne ke liye
    const err = new Error(INVALID_CREDENTIALS_MESSAGE);
    err.statusCode = 401;
    throw err;
  }

  let user = null;
  for (const candidate of candidates) {
    // Google-first accounts have NO password yet: spend the same time and
    // never match (generic "invalid credentials", no information leak).
    const passwordOk = candidate.password
      ? await bcrypt.compare(password, candidate.password)
      : (await bcrypt.compare(password, DUMMY_HASH), false);
    if (passwordOk) {
      user = candidate;
      break;
    }
  }

  if (!user) {
    const err = new Error(INVALID_CREDENTIALS_MESSAGE);
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
// FORGOT PASSWORD FLOW  (3 steps)
//   1. initiateForgotPassword  -> emails a 6-digit code (generic response)
//   2. verifyResetCode         -> checks code, returns one-time resetToken
//   3. resetUserPassword       -> uses resetToken + new password
// ═════════════════════════════════════════════════════════════════
const RESET_OTP_TTL_MS = 10 * 60 * 1000; // code valid for 10 minutes
const RESET_TOKEN_TTL_MS = 10 * 60 * 1000; // screen-2 token valid for 10 minutes
const RESET_RESEND_COOLDOWN_MS = 60 * 1000; // at most one email per minute
const RESET_MAX_ATTEMPTS = 5; // wrong guesses allowed per code

// HMAC (keyed with the server secret) instead of a bare sha256: a leaked DB
// alone is not enough to brute-force a 6-digit code offline.
const resetHash = (value) => {
  const secret = process.env.AUTH_SECRET || process.env.ADMIN_JWT_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET / ADMIN_JWT_SECRET is not set.");
  }
  return crypto
    .createHmac("sha256", secret)
    .update(String(value))
    .digest("hex");
};

const badRequest = (message, extra = {}) => {
  const err = new Error(message);
  err.statusCode = 400;
  Object.assign(err, extra);
  return err;
};

export const initiateForgotPassword = async (identifier) => {
  // Password reset is EMAIL-OTP ONLY.
  const cleanEmail = normalizeEmail(identifier);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    throw badRequest("Please enter a valid email address.");
  }

  // The limits are keyed by the (hashed) EMAIL and apply identically whether
  // or not an account exists, so lockout / cooldown responses reveal nothing
  // about account existence.
  const key = guardKey("reset", cleanEmail);
  await assertNotLocked(key); // active lockout => no new code, even on resend
  const { resendAfterSeconds } = await claimSend(key); // cooldown + hourly cap

  // SECURITY: identical response whether or not an account exists. Email
  // sending is NOT awaited so the response time does not reveal it either.
  const GENERIC_RESPONSE = {
    message:
      "If an account exists for this email, a 6-digit reset code has been sent.",
    resendAfterSeconds,
  };

  const user = await User.findOne({ email: cleanEmail, isActive: true });
  if (!user) return GENERIC_RESPONSE;

  const otp = generateOtp();

  await User.updateOne(
    { _id: user._id },
    {
      $set: {
        resetOtpHash: resetHash(otp),
        resetOtpExpiry: new Date(Date.now() + RESET_OTP_TTL_MS),
        resetOtpAttempts: 0,
        resetTokenHash: null,
        resetTokenExpiry: null,
      },
    },
  );

  // NOTE: the failed-attempt counter lives in OtpGuard and is deliberately NOT
  // reset here, so requesting a new code can never bypass the lockout.

  // Fire-and-forget (see timing note above).
  sendEmail({
    to: user.email,
    subject: "SANWARIYAS — Password Reset Code",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #E8D5A3">
        <p style="font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#C9A84C;margin:0 0 16px">Sanwariyas</p>
        <h2 style="color:#574325;margin:0 0 8px">Password Reset Code</h2>
        <p style="color:#70543E;font-size:14px;margin:0 0 24px">Your one-time code expires in <strong>10 minutes</strong>.</p>
        <div style="background:#f5efe4;border:1px solid #E8D5A3;padding:20px;text-align:center;margin-bottom:24px">
          <span style="font-size:40px;font-weight:bold;letter-spacing:14px;color:#574325">${otp}</span>
        </div>
        <p style="color:#999;font-size:12px">If you did not request this, please ignore this email.</p>
      </div>`,
  })
    .then((sent) => {
      if (sent) return;
      if (process.env.NODE_ENV === "production") {
        // Never write the code itself to production logs.
        console.error(
          `[auth] Reset email NOT delivered for user ${user._id} (RESEND_API_KEY missing or provider rejected it).`,
        );
      } else {
        console.info(`[auth][dev] Reset code for ${user.email}: ${otp}`);
      }
    })
    .catch(() => {});

  return GENERIC_RESPONSE;
};

// STEP 2 — verify the emailed code. Returns a one-time resetToken.
export const verifyResetCode = async (email, otp) => {
  const cleanEmail = normalizeEmail(email);
  const code = typeof otp === "string" ? otp.trim() : "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || !/^\d{6}$/.test(code)) {
    throw badRequest("Invalid or expired code.");
  }

  const key = guardKey("reset", cleanEmail);
  await assertNotLocked(key);
  // Atomic: this attempt is counted BEFORE the code is compared, so parallel
  // guesses can never exceed the maximum.
  const attempts = await countAttempt(key);

  const user = await User.findOne({
    email: cleanEmail,
    isActive: true,
    resetOtpHash: { $ne: null },
    resetOtpExpiry: { $gt: new Date() },
  });

  const ok = !!user && safeCompare(user.resetOtpHash, resetHash(code));
  if (!ok) await failAttempt(key, attempts); // always throws

  // Correct code -> burn it (single use) and issue the screen-2 token.
  // The filter on resetOtpHash makes this succeed only once, even if the
  // same correct code is submitted twice at the same moment.
  const resetToken = crypto.randomBytes(32).toString("hex");
  const consumed = await User.updateOne(
    { _id: user._id, resetOtpHash: user.resetOtpHash },
    {
      $set: {
        resetOtpHash: null,
        resetOtpExpiry: null,
        resetOtpAttempts: 0,
        resetTokenHash: resetHash(resetToken),
        resetTokenExpiry: new Date(Date.now() + RESET_TOKEN_TTL_MS),
      },
    },
  );
  if (consumed.matchedCount !== 1) throw badRequest("Invalid or expired code.");

  await clearAttempts(key);
  return { resetToken };
};

// UI helper: current lockout / resend state for this email (same shape for
// existing and non-existing accounts).
export const getResetStatus = async (email) => {
  const cleanEmail = normalizeEmail(email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    throw badRequest("Please enter a valid email address.");
  }
  return guardStatus(guardKey("reset", cleanEmail));
};

// STEP 3 — set the new password (needs the resetToken from step 2).
export const resetUserPassword = async (
  email,
  resetToken,
  newPassword,
  confirmPassword,
) => {
  const cleanEmail = normalizeEmail(email);

  // Same rules as signup (server/utils/validators.js). Checked BEFORE the
  // token is consumed so a weak-password typo does not force a restart.
  const fieldErrors = {};
  const pwErr = validatePassword(newPassword);
  if (pwErr) fieldErrors.password = pwErr;
  const confirmErr = pwErr
    ? ""
    : validateConfirmPassword(newPassword, confirmPassword);
  if (confirmErr) fieldErrors.confirmPassword = confirmErr;
  if (Object.keys(fieldErrors).length > 0) {
    throw badRequest(Object.values(fieldErrors)[0], { fieldErrors });
  }

  // Atomic single-use consume: a token works exactly once.
  const user = await User.findOneAndUpdate(
    {
      email: cleanEmail,
      isActive: true,
      resetTokenHash: resetHash(resetToken),
      resetTokenExpiry: { $gt: new Date() },
    },
    {
      $set: {
        resetTokenHash: null,
        resetTokenExpiry: null,
        resetOtpHash: null,
        resetOtpExpiry: null,
        resetOtpAttempts: 0,
      },
    },
    { new: true },
  );
  if (!user) {
    throw badRequest(
      "Your reset session is invalid or has expired. Please request a new code.",
    );
  }

  // The User model's pre-save hook hashes this with bcrypt (cost 12). For a
  // Google-first account this is the FIRST password: the same account (same
  // _id, same googleId) now supports both Google and email/password login.
  user.password = newPassword;
  // Log out every existing session (refresh tokens stop working).
  user.currentSessionId = null;
  await user.save();

  return true;
};

// ═════════════════════════════════════════════════════════════════
// GOOGLE SIGN-IN  (Google Identity Services ID-token flow)
//   Browser gets an ID token from Google -> POST /auth/google -> we VERIFY it
//   here (signature, issuer, audience = our client id, expiry, email_verified).
//   Rules:
//     * known Google account            -> sign in
//     * email already has a local account -> REFUSE (409). No auto-linking:
//       signup does not verify email ownership, so linking by email alone
//       would let someone pre-register a victim's email and keep access.
//     * brand-new person                 -> they must add phone/company/country
//       (phone is mandatory + unique in this B2B app) via /auth/google/complete.
// ═════════════════════════════════════════════════════════════════
const httpError = (statusCode, message, extra = {}) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  Object.assign(err, extra);
  return err;
};

const GOOGLE_SIGNIN_DENIED =
  "Unable to sign in with Google. Please try another sign-in method.";

const isReservedAdminEmail = (email) => {
  const adminEmail = normalizeEmail(process.env.ADMIN_EMAIL || "");
  return adminEmail !== "" && normalizeEmail(email) === adminEmail;
};

const googleSignupSecret = () => {
  const secret = process.env.AUTH_SECRET || process.env.ADMIN_JWT_SECRET;
  if (!secret) throw new Error("AUTH_SECRET / ADMIN_JWT_SECRET is not set.");
  return secret;
};

// Verifies the ID token with Google's public keys. google-auth-library is
// loaded lazily so the server still boots if it is not installed yet.
export const verifyGoogleCredential = async (credential) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) throw httpError(503, "Google sign-in is not configured.");
  if (
    typeof credential !== "string" ||
    credential.length < 20 ||
    credential.length > 4096
  ) {
    throw httpError(400, "Invalid Google credential.");
  }

  let payload;
  try {
    const { OAuth2Client } = await import("google-auth-library");
    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });
    payload = ticket.getPayload();
  } catch (error) {
    if (error?.code === "ERR_MODULE_NOT_FOUND") {
      throw httpError(503, "Google sign-in is not available right now.");
    }
    // 400 (not 401) on purpose: the client's 401 interceptor treats 401 as
    // "session expired" and would try a token refresh.
    throw httpError(400, "Google sign-in failed. Please try again.");
  }

  if (!payload?.sub || !payload.email || payload.email_verified !== true) {
    throw httpError(400, "Your Google email address is not verified.");
  }

  return {
    sub: String(payload.sub),
    email: normalizeEmail(payload.email),
    name: typeof payload.name === "string" ? payload.name : "",
  };
};

// `verify` is injectable only so tests can run without calling Google.
export const googleSignIn = async (
  credential,
  verify = verifyGoogleCredential,
) => {
  const g = await verify(credential);

  if (isReservedAdminEmail(g.email)) {
    throw httpError(403, GOOGLE_SIGNIN_DENIED);
  }

  const user = await User.findOne({ googleId: g.sub });
  if (user) {
    if (!user.isActive) {
      throw httpError(403, "This account has been deactivated.");
    }
    if (user.role !== "customer") {
      throw httpError(
        403,
        "Staff and admin accounts must sign in with their password and verification code.",
      );
    }
    return { needsProfile: false, user };
  }

  const existing = await User.findOne({ email: g.email });

  if (existing) {
    // Never merge by email string alone. If this is an active customer account
    // with a password and no Google identity yet, offer a LINK step that
    // requires the account password (proof of ownership).
    const linkable =
      existing.isActive &&
      existing.role === "customer" &&
      !!existing.password &&
      !existing.googleId;
    if (existing.role !== "customer") {
      throw httpError(403, GOOGLE_SIGNIN_DENIED);
    }
    if (!linkable) {
      throw httpError(
        409,
        "An account with this email already exists. Please sign in with your email and password.",
      );
    }
    const linkToken = jwt.sign(
      { type: "google_link", sub: g.sub, email: g.email },
      googleSignupSecret(),
      { algorithm: "HS256", expiresIn: "15m" },
    );
    throw httpError(
      409,
      "An account with this email already exists. Enter your password once to connect Google to it.",
      { code: "GOOGLE_LINK_REQUIRED", linkToken },
    );
  }
  // New person: short-lived signed token carrying what Google verified, so the
  // profile step cannot be used with an email/Google id the client made up.
  const signupToken = jwt.sign(
    { type: "google_signup", sub: g.sub, email: g.email, name: g.name },
    googleSignupSecret(),
    { algorithm: "HS256", expiresIn: "15m" },
  );

  return {
    needsProfile: true,
    signupToken,
    profile: { email: g.email, name: g.name },
  };
};

export const googleCompleteSignup = async ({
  signupToken,
  name,
  phone,
  countryCode,
  company,
  country,
}) => {
  let claims;
  try {
    claims = jwt.verify(signupToken, googleSignupSecret(), {
      algorithms: ["HS256"],
    });
    if (claims.type !== "google_signup") throw new Error("wrong type");
  } catch {
    throw httpError(
      400,
      "Your Google sign-up session expired. Please sign in with Google again.",
    );
  }

  if (isReservedAdminEmail(claims.email)) {
    throw httpError(403, GOOGLE_SIGNIN_DENIED);
  }

  const cc = String(countryCode ?? "")
    .replace(/\D/g, "")
    .trim();
  const cleanName = typeof name === "string" ? name.trim() : "";
  const cleanCompany = typeof company === "string" ? company.trim() : "";
  const cleanCountry = typeof country === "string" ? country.trim() : "";

  // Same validators as normal signup (server/utils/validators.js).
  const errors = {};
  const nameErr = validateName(cleanName);
  if (nameErr) errors.name = nameErr;
  const phoneErr = validatePhone(phone, cc);
  if (phoneErr) errors.phone = phoneErr;
  const companyErr = validateCompany(cleanCompany);
  if (companyErr) errors.company = companyErr;
  const countryErr =
    validateCountry(cleanCountry) ||
    validateCountryMatchesDial(cleanCountry, cc);
  if (countryErr) errors.country = countryErr;
  if (Object.keys(errors).length > 0) {
    throw httpError(400, "Please correct the highlighted fields.", {
      fieldErrors: errors,
    });
  }

  const cleanPhone = normalizePhone(phone);

  const clash = await User.findOne({
    $or: [
      { email: claims.email },
      { phone: cleanPhone },
      { googleId: claims.sub },
    ],
  }).select("email phone googleId");
  if (clash) {
    const fe = {};
    if (clash.phone === cleanPhone) {
      fe.phone = "An account with this phone number already exists.";
    }
    throw httpError(
      409,
      fe.phone || "An account with this email already exists.",
      Object.keys(fe).length ? { fieldErrors: fe } : {},
    );
  }

  try {
    return await User.create({
      name: cleanName,
      email: claims.email,
      phone: cleanPhone,
      countryCode: cc,
      company: cleanCompany,
      country: cleanCountry,

      // No password is invented: this account has none until the owner sets one
      // (verified by email code) — see accountService.confirmSetPassword.
      isVerified: true,
      googleId: claims.sub,
      authProvider: "google",
    });
  } catch (error) {
    if (error?.code === 11000) {
      const isPhone = !!error.keyPattern?.phone;
      throw httpError(
        409,
        isPhone
          ? "An account with this phone number already exists."
          : "An account with this email already exists.",
        isPhone
          ? {
              fieldErrors: {
                phone: "An account with this phone number already exists.",
              },
            }
          : {},
      );
    }
    throw error;
  }
};
