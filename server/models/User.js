// FILE: server/models/User.js

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { normalizePhone } from "../utils/normalize.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
      match: [
        /^[0-9]{8,15}$/,
        "Please enter a valid phone number",
      ],
    },
    // Stores just the dial code digits (e.g. "91") separately from `phone`
    // (which holds dial-code + local number combined). Only used to
    // prefill the country dropdown when a user edits their profile —
    // matching/uniqueness always happens on the combined `phone` field.
    countryCode: {
      type: String,
      default: "91",
      trim: true,
    },
    company: { type: String, default: "", trim: true },
    country: { type: String, default: "", trim: true },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    role: {
      type: String,
      enum: ["admin", "staff", "customer"],
      default: "customer",
    },
    // ✅ NEW: Added department for Phase 2 Staff Management
    department: {
      type: String,
      enum: ["Sales", "Digital Marketing", "Support", "Accounts", "Management", "General"],
      default: "General",
    },
    isActive: { type: Boolean, default: true },

    // Single Device Session Tracking
    currentSessionId: { type: String, default: null },

    // Track when the user was last active
    lastActiveAt: { type: Date, default: Date.now },

    // Email verification / login OTP (for customers)
    isVerified: { type: Boolean, default: false },
    verifyToken: { type: String, default: null },
    verifyExpiry: { type: Date, default: null },
    loginOtpHash: { type: String, default: null },
    loginOtpExpiry: { type: Date, default: null },
    adminOtpHash: { type: String, default: null },
    adminOtpExpiry: { type: Date, default: null },
    resetOtpHash: { type: String, default: null },
    resetOtpExpiry: { type: Date, default: null },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Normalize phone before save so the same number in different formats
// (with/without spaces, dashes, or a leading "+") is always stored the
// same way. This keeps the "unique" constraint above meaningful and
// keeps phone-based login/matching reliable.
userSchema.pre("save", function (next) {
  if (this.isModified("phone")) {
    this.phone = normalizePhone(this.phone);
  }
  next();
});

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

export default mongoose.model("User", userSchema);