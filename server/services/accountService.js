// // FILE: server/services/accountService.js
// //
// // Account-security features for a LOGGED-IN customer. Every function receives
// // the user id from the verified access token (req.authUser.id) — never from
// // the request body — and works on that SAME user document, so the permanent
// // MongoDB _id never changes:
// //   * getSecurityInfo            -> what login methods this account has
// //   * linkGoogleWithPassword     -> connect Google to an existing password account
// //                                   (proof of ownership = the account password)
// //   * linkGoogleToCurrentUser    -> connect Google while already logged in
// //   * requestSetPassword / confirmSetPassword -> Google-first user adds a
// //                                   password (proof = code sent to account email)

// //   * otpStatus                  -> lockout / resend state for the UI
// import crypto from "crypto";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// import { sendEmail, verifyGoogleCredential } from "./authService.js";
// import { normalizeEmail } from "../utils/normalize.js";
// import {
//   validateEmail,
//   validatePassword,
//   validateConfirmPassword,
// } from "../utils/validators.js";
// import {
//   guardKey,
//   assertNotLocked,
//   claimSend,
//   countAttempt,
//   failAttempt,
//   clearAttempts,
//   saveCode,
//   readCode,
//   generateCode,
//   guardStatus,
//   hmac,
//   OtpError,
// } from "../utils/otpGuard.js";

// export const httpError = (statusCode, message, meta = {}) => {
//   const err = new Error(message);
//   err.statusCode = statusCode;
//   err.meta = meta;
//   return err;
// };

// const signingSecret = () => {
//   const s = process.env.AUTH_SECRET || process.env.ADMIN_JWT_SECRET;
//   if (!s) throw new Error("AUTH_SECRET / ADMIN_JWT_SECRET is not set.");
//   return s;
// };

// // Valid bcrypt hash used to burn the same time when the account is unknown.
// const DUMMY_HASH = bcrypt.hashSync("sanwariyas-link-dummy-password", 12);

// const sameHash = (a, b) => {
//   const A = Buffer.from(String(a || ""));
//   const B = Buffer.from(String(b || ""));
//   return A.length === B.length && A.length > 0 && crypto.timingSafeEqual(A, B);
// };

// export const codeEmailHtml = (heading, intro, code) => `
//   <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #E8D5A3">
//     <p style="font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#C9A84C;margin:0 0 16px">Sanwariyas</p>
//     <h2 style="color:#574325;margin:0 0 8px">${heading}</h2>
//     <p style="color:#70543E;font-size:14px;margin:0 0 24px">${intro} It expires in <strong>10 minutes</strong>.</p>
//     <div style="background:#f5efe4;border:1px solid #E8D5A3;padding:20px;text-align:center;margin-bottom:24px">
//       <span style="font-size:40px;font-weight:bold;letter-spacing:14px;color:#574325">${code}</span>
//     </div>
//     <p style="color:#999;font-size:12px">If you did not request this, please ignore this email.</p>
//   </div>`;

// // Sends a code. In production a delivery failure is reported; in development
// // the code is printed to the server console (never in production logs).
// const deliverCode = async ({ to, subject, heading, intro, code }) => {
//   const sent = await sendEmail({
//     to,
//     subject,
//     html: codeEmailHtml(heading, intro, code),
//   });
//   if (sent) return;
//   if (process.env.NODE_ENV === "production") {
//     throw httpError(
//       503,
//       "We could not send the email right now. Please try again later.",
//     );
//   }
//   console.info(`[account][dev] Code for ${to}: ${code}`);
// };

// const loadCustomer = async (userId) => {
//   const user = await User.findById(userId);
//   if (!user || !user.isActive) throw httpError(404, "Account not found.");
//   if (user.role !== "customer") {
//     throw httpError(403, "This feature is only for customer accounts.");
//   }
//   return user;
// };

// export const getSecurityInfo = async (userId) => {
//   const user = await loadCustomer(userId);
//   return {
//     email: user.email,
//     hasPassword: !!user.password,
//     googleLinked: !!user.googleId,
//   };
// };

// // ── Google linking ────────────────────────────────────────────────────────
// // Login-time link: the person signed in with Google, but a password account
// // with that email exists. Ownership is proven with the ACCOUNT PASSWORD
// // (5 wrong tries -> 15 min lock, same policy as OTP flows).
// export const linkGoogleWithPassword = async (linkToken, password) => {
//   let claims;
//   try {
//     claims = jwt.verify(linkToken, signingSecret(), { algorithms: ["HS256"] });
//     if (claims.type !== "google_link") throw new Error("wrong type");
//   } catch {
//     throw httpError(
//       400,
//       "Your Google link session expired. Please sign in with Google again.",
//     );
//   }
//   if (typeof password !== "string" || !password) {
//     throw httpError(400, "Please enter your password.");
//   }

//   const key = guardKey("googlelink", claims.email);
//   await assertNotLocked(key);
//   const attempts = await countAttempt(key);

//   const user = await User.findOne({
//     email: claims.email,
//     isActive: true,
//     role: "customer",
//   });
//   const ok =
//     !!user && !!user.password && !user.googleId
//       ? await bcrypt.compare(password, user.password)
//       : (await bcrypt.compare(password, DUMMY_HASH), false);
//   if (!ok) await failAttempt(key, attempts, "Incorrect password.");

//   const clash = await User.findOne({ googleId: claims.sub }).select("_id");
//   if (clash && String(clash._id) !== String(user._id)) {
//     throw httpError(409, "This Google account is already connected to another account.");
//   }

//   user.googleId = claims.sub;
//   try {
//     await user.save();
//   } catch (error) {
//     if (error?.code === 11000) {
//       throw httpError(409, "This Google account is already connected to another account.");
//     }
//     throw error;
//   }
//   await clearAttempts(key);
//   return user;
// };

// // Logged-in link: the verified session proves ownership of the account.
// export const linkGoogleToCurrentUser = async (userId, credential) => {
//   const user = await loadCustomer(userId);
//   const g = await verifyGoogleCredential(credential);

//   if (user.googleId) {
//     if (user.googleId === g.sub) return user; // already connected (idempotent)
//     throw httpError(409, "A different Google account is already connected.");
//   }
//   const clash = await User.findOne({ googleId: g.sub }).select("_id");
//   if (clash) {
//     throw httpError(409, "This Google account is already connected to another account.");
//   }

//   user.googleId = g.sub;
//   try {
//     await user.save();
//   } catch (error) {
//     if (error?.code === 11000) {
//       throw httpError(409, "This Google account is already connected to another account.");
//     }
//     throw error;
//   }
//   return user;
// };

// // ── Set password (Google-first accounts) ─────────────────────────────────
// export const requestSetPassword = async (userId) => {
//   const user = await loadCustomer(userId);
//   if (user.password) {
//     throw httpError(
//       400,
//       "Your account already has a password. Use Forgot Password to change it.",
//     );
//   }
//   const key = guardKey("setpw", String(user._id));
//   await assertNotLocked(key);
//   const { resendAfterSeconds } = await claimSend(key);

//   const code = generateCode();
//   await saveCode(key, { codeHash: hmac(code) });
//   await deliverCode({
//     to: user.email,
//     subject: "SANWARIYAS — Set your password",
//     heading: "Set your password",
//     intro: "Use this code to add a password to your account.",
//     code,
//   });
//   return { message: "A 6-digit code has been sent to your account email.", resendAfterSeconds };
// };

// export const confirmSetPassword = async (
//   userId,
//   otp,
//   newPassword,
//   confirmPassword,
// ) => {
//   const code = typeof otp === "string" ? otp.trim() : "";
//   if (!/^\d{6}$/.test(code)) throw httpError(400, "Invalid or expired code.");

//   const pwErr =
//     validatePassword(newPassword) ||
//     validateConfirmPassword(newPassword, confirmPassword);
//   if (pwErr) throw httpError(400, pwErr);

//   const user = await loadCustomer(userId);
//   if (user.password) throw httpError(400, "Your account already has a password.");

//   const key = guardKey("setpw", String(user._id));
//   await assertNotLocked(key);
//   const attempts = await countAttempt(key);
//   const saved = await readCode(key);
//   if (!saved || !sameHash(saved.codeHash, hmac(code))) {
//     await failAttempt(key, attempts);
//   }

//   // Hashed by the User pre-save hook. Same _id, same googleId: Google AND
//   // email/password login now both work for this one account.
//   user.password = newPassword;
//   await user.save();
//   await clearAttempts(key);
//   return true;
// };

// // ── Email change ──────────────────────────────────────────────────────────
// // export const requestEmailChange = async (userId, rawNewEmail) => {
// //   const user = await loadCustomer(userId);
// //   const emailErr = validateEmail(rawNewEmail);
// //   if (emailErr) throw httpError(400, emailErr);
// //   const newEmail = normalizeEmail(rawNewEmail);
// //   if (newEmail === user.email) {
// //     throw httpError(400, "This is already your account email.");
// //   }
// //   // The env-configured admin has no DB row; its address must stay reserved.
// //   if (newEmail === normalizeEmail(process.env.ADMIN_EMAIL || "")) {
// //     throw httpError(409, "This email address is already in use.");
// //   }

// //   const key = guardKey("emailchange", String(user._id));
// //   await assertNotLocked(key);

// //   if (await User.exists({ email: newEmail })) {
// //     throw httpError(409, "This email address is already in use.");
// //   }

// //   const { resendAfterSeconds } = await claimSend(key);
// //   const code = generateCode();
// //   await saveCode(key, { codeHash: hmac(code), meta: { newEmail } });
// //   await deliverCode({
// //     to: newEmail,
// //     subject: "SANWARIYAS — Confirm your new email",
// //     heading: "Confirm your new email",
// //     intro: "Use this code to confirm this address for your account.",
// //     code,
// //   });
// //   return { message: `A 6-digit code has been sent to ${newEmail}.`, resendAfterSeconds };
// // };

// // export const confirmEmailChange = async (userId, otp) => {
// //   const code = typeof otp === "string" ? otp.trim() : "";
// //   if (!/^\d{6}$/.test(code)) throw httpError(400, "Invalid or expired code.");

// //   const user = await loadCustomer(userId);
// //   const oldEmail = user.email;

// //   const key = guardKey("emailchange", String(user._id));
// //   await assertNotLocked(key);
// //   const attempts = await countAttempt(key);
// //   const saved = await readCode(key);
// //   if (!saved || !saved.meta?.newEmail || !sameHash(saved.codeHash, hmac(code))) {
// //     await failAttempt(key, attempts);
// //   }

// //   const newEmail = normalizeEmail(saved.meta.newEmail);
// //   let updated;
// //   try {
// //     // Only the email changes: _id, googleId, password, role and every
// //     // inquiry/order (linked by _id) stay exactly as they were.
// //     // Pending email-based codes/tokens for the OLD address are wiped, and the
// //     // new address is verified by the code just confirmed.
// //     updated = await User.findOneAndUpdate(
// //       { _id: user._id, isActive: true },
// //       {
// //         $set: {
// //           email: newEmail,
// //           isVerified: true,
// //           verifyToken: null,
// //           verifyExpiry: null,
// //           loginOtpHash: null,
// //           loginOtpExpiry: null,
// //           resetOtpHash: null,
// //           resetOtpExpiry: null,
// //           resetOtpAttempts: 0,
// //           resetTokenHash: null,
// //           resetTokenExpiry: null,
// //         },
// //       },
// //       { new: true },
// //     );
// //   } catch (error) {
// //     if (error?.code === 11000) {
// //       throw httpError(409, "This email address is already in use.");
// //     }
// //     throw error;
// //   }
// //   if (!updated) throw httpError(404, "Account not found.");

// //   // userId is the owner. Sync ONLY this user's claimed inquiries to the new
// //   // email; nothing is deleted and other users / unclaimed guest inquiries
// //   // are never touched.
// //   await Inquiry.updateMany(
// //     { userId: updated._id },
// //     { $set: { email: newEmail } },
// //   );

// //   await clearAttempts(key);

// //   // Tell the OLD address (security notice). Never blocks the response.
// //   sendEmail({
// //     to: oldEmail,
// //     subject: "SANWARIYAS — Your account email was changed",
// //     html: `<p style="font-family:sans-serif">The email address on your SANWARIYAS account was changed. If this was not you, please contact us immediately.</p>`,
// //   }).catch(() => {});

// //   return updated;
// // };

// // ── UI helper ─────────────────────────────────────────────────────────────
// export const otpStatus = async (userId, flow, email) => {
//   if (flow === "setpw") return guardStatus(guardKey("setpw", String(userId)));
//   // if (flow === "emailchange") {
//   //   return guardStatus(guardKey("emailchange", String(userId)));
//   // }
//   if (flow === "claim") {
//     const clean = normalizeEmail(email);
//     if (validateEmail(clean)) throw httpError(400, "Please enter a valid email address.");
//     return guardStatus(guardKey("claim", `${userId}:${clean}`));
//   }
//   throw httpError(400, "Unknown flow.");
// };

// export { OtpError };

// FILE: server/services/accountService.js
//
// Account-security features for a LOGGED-IN customer. Every function receives
// the user id from the verified access token (req.authUser.id) — never from
// the request body — and works on that SAME user document, so the permanent
// MongoDB _id never changes:
//   * getSecurityInfo            -> what login methods this account has
//   * linkGoogleWithPassword     -> connect Google to an existing password account
//                                   (proof of ownership = the account password)
//   * linkGoogleToCurrentUser    -> connect Google while already logged in
//   * requestSetPassword / confirmSetPassword -> Google-first user adds a
//                                   password (proof = code sent to account email)

//   * otpStatus                  -> lockout / resend state for the UI
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

import { sendEmail, verifyGoogleCredential } from "./authService.js";
import { normalizeEmail } from "../utils/normalize.js";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "../utils/validators.js";
import {
  guardKey,
  assertNotLocked,
  claimSend,
  countAttempt,
  failAttempt,
  clearAttempts,
  saveCode,
  readCode,
  generateCode,
  guardStatus,
  hmac,
  OtpError,
} from "../utils/otpGuard.js";

export const httpError = (statusCode, message, meta = {}) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.meta = meta;
  return err;
};

const signingSecret = () => {
  const s = process.env.AUTH_SECRET || process.env.ADMIN_JWT_SECRET;
  if (!s) throw new Error("AUTH_SECRET / ADMIN_JWT_SECRET is not set.");
  return s;
};

// Valid bcrypt hash used to burn the same time when the account is unknown.
const DUMMY_HASH = bcrypt.hashSync("sanwariyas-link-dummy-password", 12);

const sameHash = (a, b) => {
  const A = Buffer.from(String(a || ""));
  const B = Buffer.from(String(b || ""));
  return A.length === B.length && A.length > 0 && crypto.timingSafeEqual(A, B);
};

export const codeEmailHtml = (heading, intro, code) => `
  <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #E8D5A3">
    <p style="font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#C9A84C;margin:0 0 16px">Sanwariyas</p>
    <h2 style="color:#574325;margin:0 0 8px">${heading}</h2>
    <p style="color:#70543E;font-size:14px;margin:0 0 24px">${intro} It expires in <strong>10 minutes</strong>.</p>
    <div style="background:#f5efe4;border:1px solid #E8D5A3;padding:20px;text-align:center;margin-bottom:24px">
      <span style="font-size:40px;font-weight:bold;letter-spacing:14px;color:#574325">${code}</span>
    </div>
    <p style="color:#999;font-size:12px">If you did not request this, please ignore this email.</p>
  </div>`;

// Sends a code. In production a delivery failure is reported; in development
// the code is printed to the server console (never in production logs).
const deliverCode = async ({ to, subject, heading, intro, code }) => {
  const sent = await sendEmail({
    to,
    subject,
    html: codeEmailHtml(heading, intro, code),
  });
  if (sent) return;
  if (process.env.NODE_ENV === "production") {
    throw httpError(
      503,
      "We could not send the email right now. Please try again later.",
    );
  }
  console.info(`[account][dev] Code for ${to}: ${code}`);
};

const loadCustomer = async (userId) => {
  const user = await User.findById(userId);
  if (!user || !user.isActive) throw httpError(404, "Account not found.");
  if (user.role !== "customer") {
    throw httpError(403, "This feature is only for customer accounts.");
  }
  return user;
};

export const getSecurityInfo = async (userId) => {
  const user = await loadCustomer(userId);
  return {
    email: user.email,
    hasPassword: !!user.password,
    googleLinked: !!user.googleId,
  };
};

// ── Google linking ────────────────────────────────────────────────────────
// Login-time link: the person signed in with Google, but a password account
// with that email exists. Ownership is proven with the ACCOUNT PASSWORD
// (5 wrong tries -> 15 min lock, same policy as OTP flows).
export const linkGoogleWithPassword = async (linkToken, password) => {
  let claims;
  try {
    claims = jwt.verify(linkToken, signingSecret(), { algorithms: ["HS256"] });
    if (claims.type !== "google_link") throw new Error("wrong type");
  } catch {
    throw httpError(
      400,
      "Your Google link session expired. Please sign in with Google again.",
    );
  }
  if (typeof password !== "string" || !password) {
    throw httpError(400, "Please enter your password.");
  }

  const key = guardKey("googlelink", claims.email);
  await assertNotLocked(key);
  const attempts = await countAttempt(key);

  const user = await User.findOne({
    email: claims.email,
    isActive: true,
    role: "customer",
  });
  const ok =
    !!user && !!user.password && !user.googleId
      ? await bcrypt.compare(password, user.password)
      : (await bcrypt.compare(password, DUMMY_HASH), false);
  if (!ok) await failAttempt(key, attempts, "Incorrect password.");

  const clash = await User.findOne({ googleId: claims.sub }).select("_id");
  if (clash && String(clash._id) !== String(user._id)) {
    throw httpError(
      409,
      "This Google account is already connected to another account.",
    );
  }

  user.googleId = claims.sub;
  try {
    await user.save();
  } catch (error) {
    if (error?.code === 11000) {
      throw httpError(
        409,
        "This Google account is already connected to another account.",
      );
    }
    throw error;
  }
  await clearAttempts(key);
  return user;
};

// Logged-in link: the verified session proves ownership of the account.
export const linkGoogleToCurrentUser = async (userId, credential) => {
  const user = await loadCustomer(userId);
  const g = await verifyGoogleCredential(credential);

  if (user.googleId) {
    if (user.googleId === g.sub) return user; // already connected (idempotent)
    throw httpError(409, "A different Google account is already connected.");
  }
  const clash = await User.findOne({ googleId: g.sub }).select("_id");
  if (clash) {
    throw httpError(
      409,
      "This Google account is already connected to another account.",
    );
  }

  user.googleId = g.sub;
  try {
    await user.save();
  } catch (error) {
    if (error?.code === 11000) {
      throw httpError(
        409,
        "This Google account is already connected to another account.",
      );
    }
    throw error;
  }
  return user;
};

// ── Set password (Google-first accounts) ─────────────────────────────────
export const requestSetPassword = async (userId) => {
  const user = await loadCustomer(userId);
  if (user.password) {
    throw httpError(
      400,
      "Your account already has a password. Use Forgot Password to change it.",
    );
  }
  const key = guardKey("setpw", String(user._id));
  await assertNotLocked(key);
  const { resendAfterSeconds } = await claimSend(key);

  const code = generateCode();
  await saveCode(key, { codeHash: hmac(code) });
  await deliverCode({
    to: user.email,
    subject: "SANWARIYAS — Set your password",
    heading: "Set your password",
    intro: "Use this code to add a password to your account.",
    code,
  });
  return {
    message: "A 6-digit code has been sent to your account email.",
    resendAfterSeconds,
  };
};

// Step 1 of 2: check the emailed code on its own. A correct code is burned
// (single use) and replaced by a short-lived verification token; only then does
// the client show the new-password screen.
export const verifySetPasswordCode = async (userId, otp) => {
  const code = typeof otp === "string" ? otp.trim() : "";
  if (!/^\d{6}$/.test(code)) throw httpError(400, "Invalid or expired code.");

  const user = await loadCustomer(userId);
  if (user.password)
    throw httpError(400, "Your account already has a password.");

  const key = guardKey("setpw", String(user._id));
  await assertNotLocked(key);
  // The attempt is counted BEFORE comparing, so parallel guesses cannot exceed
  // the maximum.
  const attempts = await countAttempt(key);
  const saved = await readCode(key);
  if (!saved || saved.meta?.verified || !sameHash(saved.codeHash, hmac(code))) {
    await failAttempt(key, attempts); // always throws
  }

  const verifyToken = crypto.randomBytes(32).toString("hex");
  await clearAttempts(key); // burns the emailed code and resets the attempts
  await saveCode(key, {
    codeHash: hmac(verifyToken),
    meta: { verified: true },
  });
  return { verifyToken };
};

// Step 2 of 2: set the password. Requires the token from verifySetPasswordCode
// (preferred). The old single-step call with the raw code is still accepted.
export const confirmSetPassword = async (
  userId,
  otp,
  newPassword,
  confirmPassword,
  verifyToken = "",
) => {
  const token = typeof verifyToken === "string" ? verifyToken.trim() : "";
  const code = typeof otp === "string" ? otp.trim() : "";
  if (!token && !/^\d{6}$/.test(code)) {
    throw httpError(400, "Invalid or expired code.");
  }

  const pwErr =
    validatePassword(newPassword) ||
    validateConfirmPassword(newPassword, confirmPassword);
  if (pwErr) throw httpError(400, pwErr);

  const user = await loadCustomer(userId);
  if (user.password)
    throw httpError(400, "Your account already has a password.");

  const key = guardKey("setpw", String(user._id));
  await assertNotLocked(key);
  const attempts = await countAttempt(key);
  const saved = await readCode(key);
  if (token) {
    if (!saved?.meta?.verified || !sameHash(saved.codeHash, hmac(token))) {
      await failAttempt(
        key,
        attempts,
        "Verification expired. Please request a new code.",
      );
    }
  } else if (
    !saved ||
    saved.meta?.verified ||
    !sameHash(saved.codeHash, hmac(code))
  ) {
    await failAttempt(key, attempts);
  }

  // Hashed by the User pre-save hook. Same _id, same googleId: Google AND
  // email/password login now both work for this one account.
  user.password = newPassword;
  await user.save();
  await clearAttempts(key);
  return true;
};

// ── Email change ──────────────────────────────────────────────────────────
// export const requestEmailChange = async (userId, rawNewEmail) => {
//   const user = await loadCustomer(userId);
//   const emailErr = validateEmail(rawNewEmail);
//   if (emailErr) throw httpError(400, emailErr);
//   const newEmail = normalizeEmail(rawNewEmail);
//   if (newEmail === user.email) {
//     throw httpError(400, "This is already your account email.");
//   }
//   // The env-configured admin has no DB row; its address must stay reserved.
//   if (newEmail === normalizeEmail(process.env.ADMIN_EMAIL || "")) {
//     throw httpError(409, "This email address is already in use.");
//   }

//   const key = guardKey("emailchange", String(user._id));
//   await assertNotLocked(key);

//   if (await User.exists({ email: newEmail })) {
//     throw httpError(409, "This email address is already in use.");
//   }

//   const { resendAfterSeconds } = await claimSend(key);
//   const code = generateCode();
//   await saveCode(key, { codeHash: hmac(code), meta: { newEmail } });
//   await deliverCode({
//     to: newEmail,
//     subject: "SANWARIYAS — Confirm your new email",
//     heading: "Confirm your new email",
//     intro: "Use this code to confirm this address for your account.",
//     code,
//   });
//   return { message: `A 6-digit code has been sent to ${newEmail}.`, resendAfterSeconds };
// };

// export const confirmEmailChange = async (userId, otp) => {
//   const code = typeof otp === "string" ? otp.trim() : "";
//   if (!/^\d{6}$/.test(code)) throw httpError(400, "Invalid or expired code.");

//   const user = await loadCustomer(userId);
//   const oldEmail = user.email;

//   const key = guardKey("emailchange", String(user._id));
//   await assertNotLocked(key);
//   const attempts = await countAttempt(key);
//   const saved = await readCode(key);
//   if (!saved || !saved.meta?.newEmail || !sameHash(saved.codeHash, hmac(code))) {
//     await failAttempt(key, attempts);
//   }

//   const newEmail = normalizeEmail(saved.meta.newEmail);
//   let updated;
//   try {
//     // Only the email changes: _id, googleId, password, role and every
//     // inquiry/order (linked by _id) stay exactly as they were.
//     // Pending email-based codes/tokens for the OLD address are wiped, and the
//     // new address is verified by the code just confirmed.
//     updated = await User.findOneAndUpdate(
//       { _id: user._id, isActive: true },
//       {
//         $set: {
//           email: newEmail,
//           isVerified: true,
//           verifyToken: null,
//           verifyExpiry: null,
//           loginOtpHash: null,
//           loginOtpExpiry: null,
//           resetOtpHash: null,
//           resetOtpExpiry: null,
//           resetOtpAttempts: 0,
//           resetTokenHash: null,
//           resetTokenExpiry: null,
//         },
//       },
//       { new: true },
//     );
//   } catch (error) {
//     if (error?.code === 11000) {
//       throw httpError(409, "This email address is already in use.");
//     }
//     throw error;
//   }
//   if (!updated) throw httpError(404, "Account not found.");

//   // userId is the owner. Sync ONLY this user's claimed inquiries to the new
//   // email; nothing is deleted and other users / unclaimed guest inquiries
//   // are never touched.
//   await Inquiry.updateMany(
//     { userId: updated._id },
//     { $set: { email: newEmail } },
//   );

//   await clearAttempts(key);

//   // Tell the OLD address (security notice). Never blocks the response.
//   sendEmail({
//     to: oldEmail,
//     subject: "SANWARIYAS — Your account email was changed",
//     html: `<p style="font-family:sans-serif">The email address on your SANWARIYAS account was changed. If this was not you, please contact us immediately.</p>`,
//   }).catch(() => {});

//   return updated;
// };

// ── UI helper ─────────────────────────────────────────────────────────────
export const otpStatus = async (userId, flow, email) => {
  if (flow === "setpw") return guardStatus(guardKey("setpw", String(userId)));
  // if (flow === "emailchange") {
  //   return guardStatus(guardKey("emailchange", String(userId)));
  // }
  if (flow === "claim") {
    const clean = normalizeEmail(email);
    if (validateEmail(clean))
      throw httpError(400, "Please enter a valid email address.");
    return guardStatus(guardKey("claim", `${userId}:${clean}`));
  }
  throw httpError(400, "Unknown flow.");
};

export { OtpError };
