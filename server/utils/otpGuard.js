// FILE: server/utils/otpGuard.js
//
// Shared, DATABASE-BACKED limits for every one-time-code flow
// (forgot password, set password, email change, inquiry claim, Google link).
//
// POLICY (one place, used everywhere):
//   MAX_ATTEMPTS      5 wrong tries, then the flow is locked
//   LOCK_MS           15 minutes lockout
//   COOLDOWN_MS       60 s between two code emails
//   MAX_SENDS_PER_HOUR 5 code emails per hour
//   CODE_TTL_MS       10 minutes code lifetime
// The old code had NO per-code limit at all (only the IP rate limiter,
// 20 requests / 15 min shared by every auth route), so these values are the
// project's first explicit OTP policy.
//
// Because the state lives in MongoDB (not in the browser or in memory):
//   * a page refresh cannot reset it,
//   * asking for a NEW code does not reset the failed attempts,
//   * parallel requests cannot exceed the limit (the counter is bumped with
//     one atomic findOneAndUpdate BEFORE the code is checked).
import crypto from "crypto";
import OtpGuard from "../models/OtpGuard.js";

export const OTP_POLICY = {
  MAX_ATTEMPTS: 5,
  LOCK_MS: 15 * 60 * 1000,
  COOLDOWN_MS: 60 * 1000,
  MAX_SENDS_PER_HOUR: 5,
  HOUR_MS: 60 * 60 * 1000,
  CODE_TTL_MS: 10 * 60 * 1000,
};

export class OtpError extends Error {
  constructor(statusCode, message, meta = {}) {
    super(message);
    this.statusCode = statusCode;
    this.meta = meta;
  }
}

const secret = () => {
  const s = process.env.AUTH_SECRET || process.env.ADMIN_JWT_SECRET;
  if (!s) throw new Error("AUTH_SECRET / ADMIN_JWT_SECRET is not set.");
  return s;
};

export const hmac = (value) =>
  crypto.createHmac("sha256", secret()).update(String(value)).digest("hex");

export const guardKey = (purpose, subject) => `${purpose}:${hmac(subject)}`;

export const generateCode = () => String(crypto.randomInt(100000, 1000000));

const secs = (ms) => Math.max(1, Math.ceil(ms / 1000));
const ttlDate = (ms) => new Date(Date.now() + ms);
const GUARD_TTL_MS = 2 * 60 * 60 * 1000;

const lockedError = (lockedUntil) =>
  new OtpError(
    429,
    "Too many incorrect attempts. Please try again later.",
    {
      code: "OTP_LOCKED",
      retryAfterSeconds: secs(new Date(lockedUntil).getTime() - Date.now()),
    },
  );

// Throws if the flow is locked. Clears an EXPIRED lock (fresh attempts).
export const assertNotLocked = async (key) => {
  const g = await OtpGuard.findOne({ key });
  if (!g || !g.lockedUntil) return g;
  if (g.lockedUntil.getTime() > Date.now()) throw lockedError(g.lockedUntil);
  await OtpGuard.updateOne(
    { key },
    { $set: { attempts: 0, lockedUntil: null } },
  );
  return null;
};

// Enforces cooldown + hourly cap for SENDING a code. Atomic: two requests in
// the same instant cannot both pass (the loser hits the unique key).
export const claimSend = async (key) => {
  const now = Date.now();
  const existing = await OtpGuard.findOne({ key });

  if (
    existing?.sendWindowStart &&
    now - existing.sendWindowStart.getTime() < OTP_POLICY.HOUR_MS &&
    existing.sendCount >= OTP_POLICY.MAX_SENDS_PER_HOUR
  ) {
    const wait = secs(
      existing.sendWindowStart.getTime() + OTP_POLICY.HOUR_MS - now,
    );
    throw new OtpError(
      429,
      "Too many code requests. Please try again later.",
      { code: "OTP_SEND_LIMIT", retryAfterSeconds: wait, resendAfterSeconds: wait },
    );
  }

  const cooldownStart = new Date(now - OTP_POLICY.COOLDOWN_MS);
  const cooldownError = () => {
    const last = existing?.lastSentAt?.getTime() || now;
    const wait = secs(last + OTP_POLICY.COOLDOWN_MS - now);
    return new OtpError(
      429,
      `Please wait ${wait} seconds before requesting another code.`,
      { code: "OTP_COOLDOWN", resendAfterSeconds: wait },
    );
  };

  try {
    const res = await OtpGuard.updateOne(
      {
        key,
        $or: [
          { lastSentAt: null },
          { lastSentAt: { $lte: cooldownStart } },
        ],
      },
      {
        $set: { lastSentAt: new Date(now), expireAt: ttlDate(GUARD_TTL_MS) },
        $setOnInsert: { attempts: 0 },
      },
      { upsert: true },
    );
    if (res.matchedCount === 0 && !res.upsertedCount && !res.upsertedId) {
      throw cooldownError();
    }
  } catch (error) {
    if (error?.code === 11000) throw cooldownError();
    throw error;
  }

  const windowFresh =
    existing?.sendWindowStart &&
    now - existing.sendWindowStart.getTime() < OTP_POLICY.HOUR_MS;
  if (windowFresh) {
    await OtpGuard.updateOne({ key }, { $inc: { sendCount: 1 } });
  } else {
    await OtpGuard.updateOne(
      { key },
      { $set: { sendWindowStart: new Date(now), sendCount: 1 } },
    );
  }

  return { resendAfterSeconds: secs(OTP_POLICY.COOLDOWN_MS) };
};

// Counts ONE verification attempt atomically BEFORE the code is compared.
export const countAttempt = async (key) => {
  let g = null;
  for (let i = 0; i < 2 && !g; i += 1) {
    try {
      g = await OtpGuard.findOneAndUpdate(
        { key },
        {
          $inc: { attempts: 1 },
          $set: { expireAt: ttlDate(GUARD_TTL_MS) },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    } catch (error) {
      if (error?.code !== 11000) throw error; // concurrent first insert: retry
    }
  }
  if (!g) throw new Error("Could not record the attempt.");

  if (g.attempts > OTP_POLICY.MAX_ATTEMPTS) {
    const until = g.lockedUntil || ttlDate(OTP_POLICY.LOCK_MS);
    if (!g.lockedUntil) {
      await OtpGuard.updateOne({ key }, { $set: { lockedUntil: until } });
    }
    throw lockedError(until);
  }
  return g.attempts;
};

// Call after a WRONG code. Locks when the maximum is reached.
export const failAttempt = async (key, attempts, message) => {
  if (attempts >= OTP_POLICY.MAX_ATTEMPTS) {
    const until = ttlDate(OTP_POLICY.LOCK_MS);
    await OtpGuard.updateOne(
      { key },
      {
        $set: {
          lockedUntil: until,
          expireAt: new Date(until.getTime() + OTP_POLICY.HOUR_MS),
        },
      },
    );
    throw lockedError(until);
  }
  throw new OtpError(400, message || "Invalid or expired code.", {
    attemptsLeft: OTP_POLICY.MAX_ATTEMPTS - attempts,
  });
};

export const clearAttempts = (key) =>
  OtpGuard.updateOne(
    { key },
    {
      $set: {
        attempts: 0,
        lockedUntil: null,
        codeHash: null,
        codeExpiry: null,
        meta: null,
      },
    },
  );

export const saveCode = (key, { codeHash, meta = null }) =>
  OtpGuard.updateOne(
    { key },
    {
      $set: {
        codeHash,
        codeExpiry: ttlDate(OTP_POLICY.CODE_TTL_MS),
        meta,
      },
    },
  );

export const readCode = async (key) => {
  const g = await OtpGuard.findOne({ key });
  if (!g?.codeHash || !g.codeExpiry || g.codeExpiry.getTime() < Date.now()) {
    return null;
  }
  return { codeHash: g.codeHash, meta: g.meta };
};

// Read-only state for the UI (works for ANY subject, existing or not, so it
// reveals nothing about whether an account exists).
export const guardStatus = async (key) => {
  const g = await OtpGuard.findOne({ key });
  const now = Date.now();
  const out = {
    locked: false,
    retryAfterSeconds: 0,
    resendAfterSeconds: 0,
    attemptsLeft: OTP_POLICY.MAX_ATTEMPTS,
  };
  if (!g) return out;

  if (g.lockedUntil && g.lockedUntil.getTime() > now) {
    out.locked = true;
    out.retryAfterSeconds = secs(g.lockedUntil.getTime() - now);
  } else {
    out.attemptsLeft = Math.max(OTP_POLICY.MAX_ATTEMPTS - (g.attempts || 0), 0);
  }
  if (g.lastSentAt) {
    const left = g.lastSentAt.getTime() + OTP_POLICY.COOLDOWN_MS - now;
    if (left > 0) out.resendAfterSeconds = secs(left);
  }
  if (
    g.sendWindowStart &&
    now - g.sendWindowStart.getTime() < OTP_POLICY.HOUR_MS &&
    g.sendCount >= OTP_POLICY.MAX_SENDS_PER_HOUR
  ) {
    out.resendAfterSeconds = Math.max(
      out.resendAfterSeconds,
      secs(g.sendWindowStart.getTime() + OTP_POLICY.HOUR_MS - now),
    );
  }
  if (out.locked) out.resendAfterSeconds = Math.max(out.resendAfterSeconds, out.retryAfterSeconds);
  return out;
};