// FILE: server/utils/authUtils.js
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";

// track  the  admin  session  in memory   store

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

const TOKEN_EXPIRY = process.env.AUTH_TOKEN_EXPIRY || "1d";

export const safeCompare = (a, b) => {
  const strA = String(a ?? "");
  const strB = String(b ?? "");
  if (strA.length !== strB.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(strA), Buffer.from(strB));
  } catch {
    return false;
  }
};

export const createAuthToken = (payload) => {
  return jwt.sign(payload, getSecret(), {
    expiresIn: TOKEN_EXPIRY,
    algorithm: "HS256",
  });
};

export const verifyAuthToken = (token) => {
  if (!token || typeof token !== "string") {
    throw new Error("No token provided");
  }
  return jwt.verify(token, getSecret(), { algorithms: ["HS256"] });
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

    const payload = verifyAuthToken(token);
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!roles.includes(payload.role)) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied." });
    }

    // STRICT SINGLE SESSION CHECK
    if (payload.role === "admin") {
      const activeSession = adminSessionStore.get(payload.email);

      // if  the   token   is  not  latest  means  the  admin  login   at  another  place
      if (activeSession && activeSession !== payload.sessionId) {
        return res.status(401).json({
          success: false,
          message: "Session expired.",
        });
      }
    } else if (payload.role === "customer") {
      // ✅ FIX: Added .maxTimeMS(5000) and .lean() to prevent MongoDB hangs
      const user = await User.findById(payload.id)
        .select("currentSessionId")
        .maxTimeMS(5000)
        .lean();

      // if  db  session  not match  auto  logout
      if (!user || user.currentSessionId !== payload.sessionId) {
        return res.status(401).json({
          success: false,
          message: "Session expired.",
        });
      }
    }
    req.authUser = payload;
    next();
  } catch (error) {
    const message =
      error.name === "TokenExpiredError"
        ? "Your session has expired. Please log in again."
        : "Invalid or expired session.";
    return res.status(401).json({ success: false, message });
  }
};

export const requireAdmin = requireRole("admin");
export const requireStaff = requireRole(["admin", "staff"]);
export const requireAuth = requireRole(["admin", "staff", "customer"]);
