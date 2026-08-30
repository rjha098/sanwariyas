// FILE: server/utils/authUtils.js

import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";

// In-Memory Store for ENV-only Root Admins
export const adminSessionStore = new Map();

const getSecret = () => {
  const secret = process.env.ADMIN_JWT_SECRET || process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "AUTH_SECRET / ADMIN_JWT_SECRET is not set in environment variables.",
    );
  }
  return secret;
};


const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

// Constant-time string comparison to prevent Timing Attacks
export const safeCompare = (a, b) => {
  const strA = String(a ?? "");
  const strB = String(b ?? "");
  const hashA = crypto.createHash("sha256").update(strA).digest();
  const hashB = crypto.createHash("sha256").update(strB).digest();
  return crypto.timingSafeEqual(hashA, hashB) && strA.length === strB.length;
};

export const createAccessToken = (payload) =>
  jwt.sign({ ...payload, type: "access" }, getSecret(), {
    algorithm: "HS256",
    expiresIn: ACCESS_TOKEN_EXPIRY, // "15m"
  });




export const createRefreshToken = (payload) =>
  jwt.sign({ ...payload, type: "refresh" }, getSecret(), {
    algorithm: "HS256",
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });



export const verifyAccessToken = (token) => {
  const decoded = jwt.verify(token, getSecret(), { algorithms: ["HS256"] });
  if (decoded.type !== "access") {
    const err = new Error("Invalid token type.");
    err.statusCode = 401;
    throw err;
  }
  return decoded;
};


export const verifyRefreshToken = (token) => {
  const decoded = jwt.verify(token, getSecret(), { algorithms: ["HS256"] });
  if (decoded.type !== "refresh") {
    const err = new Error("Invalid token type.");
    err.statusCode = 401;
    throw err;
  }
  return decoded;
};

// ── Route protection middlewares ─────────────────────────────
export const requireRole = (allowedRoles) => async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication required." });
    }

    // Verify fast, short-lived Access Token purely in memory. NO DATABASE HIT.
    const payload = verifyAccessToken(token);
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!roles.includes(payload.role)) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied." });
    }

    req.authUser = payload;
    next();
  } catch (error) {
    // If Access Token is expired, trigger 401. Frontend interceptor will catch this and call /refresh automatically.
    return res.status(401).json({ success: false, message: "Token expired" });
  }
};

export const requireAdmin = requireRole("admin");
export const requireStaff = requireRole(["admin", "staff"]);
export const requireAuth = requireRole(["admin", "staff", "customer"]);
