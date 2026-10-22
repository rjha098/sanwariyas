// FILE: server/services/inquiryClaimService.js
//
// Attaches EXISTING GUEST inquiries (userId: null) to the logged-in account,
// but only after the person proves they control the inquiry's email address
// with a one-time code. Matching email/phone strings alone NEVER links
// anything. Inquiry _id, replies, status, images and notifications are not
// touched — only `userId` (and `claimedAt`) are set.
import Inquiry from "../models/Inquiry.js";
import User from "../models/User.js";
import { sendEmail } from "./authService.js";
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
  hmac,
} from "../utils/otpGuard.js";
import crypto from "crypto";
import { codeEmailHtml, httpError } from "./accountService.js";

const sameHash = (a, b) => {
  const A = Buffer.from(String(a || ""));
  const B = Buffer.from(String(b || ""));
  return A.length === B.length && A.length > 0 && crypto.timingSafeEqual(A, B);
};

// The only email a customer may claim inquiries for is their own verified
// account email, read from the database. Nothing the client sends is trusted.
const loadClaimantEmail = async (userId) => {
  const u = await User.findById(userId)
    .select("email isActive isVerified role")
    .lean();
  if (!u || !u.isActive || u.role !== "customer" || !u.isVerified) {
    throw httpError(403, "A verified customer account is required.");
  }
  return u.email;
};

const claimKey = (userId, email) => guardKey("claim", `${userId}:${email}`);

export const requestInquiryClaim = async (userId) => {
  const email = await loadClaimantEmail(userId);

  const key = claimKey(userId, email);
  await assertNotLocked(key);

  // Only send a code when this email really has unclaimed inquiries;
  // otherwise tell the user so they can correct the email.
  const pending = await Inquiry.countDocuments({ userId: null, email });
  if (pending === 0) {
    throw httpError(404, "No unclaimed inquiry found for this email.");
  }

  const { resendAfterSeconds } = await claimSend(key); // cooldown + hourly cap
  const response = {
    message: `A 6-digit code has been sent to ${email}.`,
    resendAfterSeconds,
  };

  const code = generateCode();
  await saveCode(key, { codeHash: hmac(code), meta: { email } });
  sendEmail({
    to: email,
    subject: "SANWARIYAS — Confirm your inquiries",
    html: codeEmailHtml(
      "Confirm your inquiries",
      "Use this code to add your earlier inquiries to your account.",
      code,
    ),
  })
    .then((sent) => {
      if (!sent && process.env.NODE_ENV !== "production") {
        console.info(`[claim][dev] Code for ${email}: ${code}`);
      }
    })
    .catch(() => {});

  return response;
};

export const confirmInquiryClaim = async (userId, otp) => {
  const code = typeof otp === "string" ? otp.trim() : "";
  if (!/^\d{6}$/.test(code)) {
    throw httpError(400, "Invalid or expired code.");
  }
  const email = await loadClaimantEmail(userId);

  const key = claimKey(userId, email);
  await assertNotLocked(key);
  const attempts = await countAttempt(key);
  const saved = await readCode(key);
  if (
    !saved ||
    saved.meta?.email !== email ||
    !sameHash(saved.codeHash, hmac(code))
  ) {
    await failAttempt(key, attempts);
  }

  // Only unclaimed rows can be claimed, so a second claim changes nothing
  // (no duplicates) and another user's inquiries can never be taken over.
  const result = await Inquiry.updateMany(
    { userId: null, email },
    { $set: { userId, claimedAt: new Date() } },
  );
  await clearAttempts(key);
  return { claimed: result.modifiedCount ?? result.nModified ?? 0 };
};