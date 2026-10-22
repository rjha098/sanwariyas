// FILE: server/models/OtpGuard.js
//
// One document per (purpose + subject), e.g. "reset:<hmac of email>".
// It stores the SECURITY STATE of a one-time-code flow so it survives page
// refreshes, server restarts and "request a new code" tricks:
//   - failed-attempt counter + lockout time
//   - resend cooldown + hourly send counter
//   - (optionally) the code hash itself for flows that have no user field
// The subject is stored only as an HMAC, never as a plain email.
import mongoose from "mongoose";

const otpGuardSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    attempts: { type: Number, default: 0 },
    lockedUntil: { type: Date, default: null },
    lastSentAt: { type: Date, default: null },
    sendCount: { type: Number, default: 0 },
    sendWindowStart: { type: Date, default: null },
    codeHash: { type: String, default: null },
    codeExpiry: { type: Date, default: null },
    meta: { type: mongoose.Schema.Types.Mixed, default: null },
    // MongoDB deletes the document automatically after this time (TTL).
    expireAt: { type: Date, required: true },
  },
  { timestamps: true },
);

otpGuardSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("OtpGuard", otpGuardSchema);
