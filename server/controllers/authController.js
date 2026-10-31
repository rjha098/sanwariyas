// FILE: server/controllers/authController.js
//usage --->>>>  controllers/authController.js & services/authService.js: Handles the heavy lifting of user identity. It processes customer signups, issues HTTP-only cookies, triggers Resend OTP emails for staff/admin 2FA, and seamlessly merges old "guest" inquiries into new accounts based on matching phone/email data.

import crypto from "crypto";
import { validatePassword } from "../utils/validators.js";
import { COUNTRY_DIAL_CODES } from "../utils/countryDialCodes.js";

const STAFF_DEPARTMENTS = [
  "Sales",
  "Digital Marketing",
  "Support",
  "Accounts",
  "Management",
  "General",
];

import {
  createAccessToken,
  createRefreshToken,
  safeCompare,
  verifyRefreshToken,
  setAdminSession,
  getAdminSession,
  deleteAdminSession,
} from "../utils/authUtils.js";
import { removeStoredInquiryImages } from "../middlewares/inquiryUpload.js";

import Order from "../models/Order.js";
import PushSubscription from "../models/PushSubscription.js";
// In-memory presence state for the pure ENV-based root admin (no DB user
// row to store this on). Declared here, at the top, since several
// functions below reference it — declaring it after those functions
// worked at runtime (module load always finishes before any request
// handler runs), but reads confusingly. Moved for clarity only; behaviour
// is unchanged.
let envAdminVisible = true;
let envAdminLastActiveAt = null;

// Helper to set HTTP-Only cookie for cross-origin domains

const setRefreshTokenCookie = (res, token, role) => {
  const isProduction = process.env.NODE_ENV === "production";

  // Admin/Staff cookies  is  deleted in  7 days , for  customer  30  days

  const days = role === "admin" || role === "staff" ? 7 : 30;
  const maxAgeMs = days * 24 * 60 * 60 * 1000;

  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: maxAgeMs,
  });
};

// for  delete the  cookies  in correct  method

const clearRefreshTokenCookie = (res) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });
};

import * as authService from "../services/authService.js";
import * as accountService from "../services/accountService.js";
import User from "../models/User.js";
import Inquiry from "../models/Inquiry.js";

export const customerSignup = async (req, res) => {
  try {
    await authService.signupCustomer(req.body);
    return res
      .status(201)
      .json({ success: true, message: "Account created! You can now log in." });
  } catch (error) {
    // Rare race condition: two signups with the same email/phone hit the
    // DB at nearly the same time and both pass the earlier existence check.
    if (error.code === 11000) {
      const field = error.keyPattern?.email ? "email" : "phone number";
      return res.status(409).json({
        success: false,
        message: `An account with this ${field} already exists.`,
      });
    }
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error during signup.",
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    await authService.verifyUserEmail(req.query.token);
    return res.json({
      success: true,
      message: "Email verified! You can now log in.",
    });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message || "Server error." });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body || {};
    // Must be non-empty STRINGS: objects/arrays/numbers (e.g. NoSQL-style
    // payloads) would crash on .trim() and surface a 500 with internals.
    if (
      typeof identifier !== "string" ||
      typeof password !== "string" ||
      !identifier.trim() ||
      !password
    )
      return res
        .status(400)
        .json({ success: false, message: "Identifier and password required." });

    const adminUsername = (process.env.ADMIN_USERNAME || "admin")
      .trim()
      .toLowerCase();
    const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const adminPassword = (process.env.ADMIN_PASSWORD || "").trim();
    const adminPhone = (process.env.ADMIN_PHONE || "")
      .trim()
      .replace(/[\s-]/g, "");

    const id = identifier.trim().toLowerCase();
    const cleanPhoneInput = identifier.trim().replace(/[\s-\+]/g, "");

    // ENV ADMIN CHECK
    const isAdminId =
      safeCompare(id, adminUsername) ||
      safeCompare(id, adminEmail) ||
      (adminPhone !== "" && cleanPhoneInput === adminPhone);

    if (isAdminId) {
      if (safeCompare(password.trim(), adminPassword)) {
        const emailHint = await authService.initiateAdminLogin(adminEmail);
        return res.json({
          success: true,
          requires2FA: true,
          role: "admin",
          emailHint,
        });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials." });
      }
    }

    // DB USER CHECK
    const user = await authService.loginUser(identifier, password);

    // Admin/Staff 2FA
    if (user.role === "admin" || user.role === "staff") {
      const emailHint = await authService.initiateAdminLogin(user.email);
      return res.json({
        success: true,
        requires2FA: true,
        role: user.role,
        department: user.department || "General",
        emailHint,
      });
    }

    // CUSTOMER DIRECT LOGIN (RFC 4122 Standard UUID)
    const sessionId = crypto.randomUUID();

    await User.findByIdAndUpdate(user.id, { currentSessionId: sessionId });

    // Guest inquiries are NOT auto-linked here any more (matching email/phone
    // is not proof of ownership). They are claimed with an emailed code:
    // POST /api/inquiry/claim/request + /claim/confirm.

    const payload = {
      role: user.role,
      id: user.id,
      email: user.email,
      name: user.name,
      department: user.department || "General",
      sessionId,
    };

    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken(payload);

    setRefreshTokenCookie(res, refreshToken, payload.role);

    return res.json({
      success: true,
      requires2FA: false,
      token: accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department || "General",
      },
    });
  } catch (error) {
    // Only errors we raised on purpose (they carry a statusCode) show their
    // message; unexpected errors get a generic text so internals never leak.
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode
        ? error.message
        : "Server error during login. Please try again.",
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { otp, role, identifier } = req.body;
    if (!otp || !role)
      return res
        .status(400)
        .json({ success: false, message: "OTP and role are required." });

    const sessionId = crypto.randomUUID();

    if (role === "admin" || role === "staff") {
      let emailForOtp = identifier.trim().toLowerCase();
      const adminUsername = (process.env.ADMIN_USERNAME || "admin")
        .trim()
        .toLowerCase();
      const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
      const adminPhone = (process.env.ADMIN_PHONE || "")
        .trim()
        .replace(/[\s-]/g, "");

      if (emailForOtp === adminUsername || emailForOtp === adminPhone) {
        emailForOtp = adminEmail;
      } else if (emailForOtp !== adminEmail && !emailForOtp.includes("@")) {
        const dbUser = await User.findOne({
          phone: emailForOtp,
          isActive: true,
        });

        if (dbUser) emailForOtp = dbUser.email;
      }

      await authService.verifyAdminOtp(emailForOtp, otp);

      // SECURITY: the DB user's email ALREADY passed OTP verification above —
      // but we still need to know who they actually are before trusting
      // anything. We re-fetch (rather than reuse) so this check always runs
      // against the current DB state, not a stale lookup made earlier in
      // this function.
      const preCheckUser = await User.findOne({ email: emailForOtp });

      if (preCheckUser && preCheckUser.isActive === false) {
        // Belt-and-suspenders: loginUser() already blocks a deactivated
        // account from ever reaching the password step, so this only
        // matters for the narrow race where an account is deactivated
        // WHILE a valid OTP is still pending in its 10-minute window.
        const err = new Error(
          "This account has been deactivated. Please contact an administrator.",
        );
        err.statusCode = 403;
        throw err;
      }

      // SECURITY FIX (role escalation): the actual role a token is minted
      // with must come from the verified identity, NEVER from req.body.
      // `role` above is only used to pick which branch of this function to
      // run — it must not be trusted past this point.
      //   - preCheckUser exists  -> use THEIR real DB role, and only if it
      //     is actually "admin" or "staff" (a customer's adminOtpHash
      //     should never be set, but we don't trust that invariant blindly).
      //   - preCheckUser is null -> OTP succeeded via the in-memory
      //     fallback store, which is only ever populated for the literal
      //     configured ADMIN_EMAIL (see authService.initiateAdminLogin /
      //     the isAdminId check in login()), so this can only be the real
      //     pure-ENV admin.
      let verifiedRole;
      if (preCheckUser) {
        if (!["admin", "staff"].includes(preCheckUser.role)) {
          const err = new Error(
            "This account is not authorized for this login method.",
          );
          err.statusCode = 403;
          throw err;
        }
        verifiedRole = preCheckUser.role;
      } else {
        verifiedRole = "admin";
      }

      // Hybrid Session Creation
      let dbUser = await User.findOneAndUpdate(
        { email: emailForOtp },
        { currentSessionId: sessionId },
        { new: true },
      );

      // If DB User doesn't exist (Pure ENV Admin), store session in MongoDB
      if (!dbUser) {
        await setAdminSession(emailForOtp, sessionId);
      }

      const usernameOutput =
        emailForOtp === adminEmail ? adminUsername : emailForOtp.split("@")[0];

      const payload = {
        role: verifiedRole,
        id: dbUser ? dbUser._id.toString() : null,
        username: usernameOutput,
        email: emailForOtp,
        name: dbUser ? dbUser.name : usernameOutput,
        department: dbUser?.department || "Management",
        sessionId,
      };

      const accessToken = createAccessToken(payload);
      const refreshToken = createRefreshToken(payload);

      setRefreshTokenCookie(res, refreshToken, payload.role);

      return res.json({
        success: true,
        token: accessToken,
        user: {
          id: dbUser?._id || null,
          username: usernameOutput,
          name: dbUser ? dbUser.name : usernameOutput,
          email: emailForOtp,
          role: verifiedRole,
          department: dbUser?.department || "Management",
        },
      });
    }
    return res.status(400).json({ success: false, message: "Invalid role." });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message || "Server error." });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { identifier } = req.body || {};

    if (!identifier || typeof identifier !== "string")
      return res
        .status(400)
        .json({ success: false, message: "Email address required." });

    const result = await authService.initiateForgotPassword(identifier);
    return res.json({ success: true, ...result });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,

      message: error.statusCode
        ? error.message
        : "Server error. Please try again.",
      ...(error.meta || {}),
    });
  }
};

// Step 2: verify the emailed code -> returns a one-time resetToken.
export const verifyResetCode = async (req, res) => {
  try {
    const { email, otp } = req.body || {};
    if (typeof email !== "string" || typeof otp !== "string") {
      return res.status(400).json({
        success: false,
        message: "Email and code are required.",
      });
    }

    const { resetToken } = await authService.verifyResetCode(email, otp);
    return res.json({
      success: true,
      message: "Code verified. Set your new password.",
      resetToken,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,

      message: error.statusCode
        ? error.message
        : "Server error. Please try again.",
      ...(error.meta || {}),
    });
  }
};

// Step 3: new password + confirm password (needs resetToken from step 2).
export const resetPassword = async (req, res) => {
  try {
    const { email, resetToken, newPassword, confirmPassword } = req.body || {};

    // Strict type check so objects/arrays can never reach the database layer.
    if (
      typeof email !== "string" ||
      typeof resetToken !== "string" ||
      typeof newPassword !== "string" ||
      typeof confirmPassword !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required and must be valid text.",
      });
    }

    await authService.resetUserPassword(
      email,
      resetToken,
      newPassword,
      confirmPassword,
    );

    return res.json({
      success: true,
      message: "Password updated. You can now sign in with your new password.",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode
        ? error.message
        : "Server error. Please try again.",
      ...(error.fieldErrors ? { fieldErrors: error.fieldErrors } : {}),
    });
  }
};

// Shared by the Google endpoints: same session setup as a normal customer
// login (single-device session id, access token, HttpOnly refresh cookie).
const issueCustomerSession = async (res, user) => {
  const id = String(user._id || user.id);
  const sessionId = crypto.randomUUID();
  await User.findByIdAndUpdate(id, { currentSessionId: sessionId });

  const payload = {
    role: user.role,
    id,
    email: user.email,
    name: user.name,
    department: user.department || "General",
    sessionId,
  };
  const token = createAccessToken(payload);
  setRefreshTokenCookie(res, createRefreshToken(payload), payload.role);

  return {
    token,
    user: {
      id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department || "General",
    },
  };
};

const googleError = (res, error) =>
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.statusCode
      ? error.message
      : "Server error during Google sign-in. Please try again.",
    ...(error.meta?.fieldErrors ? { errors: error.meta.fieldErrors } : {}),
    ...(error.meta || {}),
  });

export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body || {};
    if (typeof credential !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Google credential is required." });
    }

    const result = await authService.googleSignIn(credential);
    if (result.needsProfile) {
      return res.json({
        success: true,
        needsProfile: true,
        signupToken: result.signupToken,
        profile: result.profile,
      });
    }

    const session = await issueCustomerSession(res, result.user);
    return res.json({
      success: true,
      requires2FA: false,
      ...session,
    });
  } catch (error) {
    return googleError(res, error);
  }
};

export const googleComplete = async (req, res) => {
  try {
    const body = req.body || {};
    if (typeof body.signupToken !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Sign-up session is required." });
    }

    const user = await authService.googleCompleteSignup(body);
    const session = await issueCustomerSession(res, user);
    return res.status(201).json({
      success: true,
      requires2FA: false,
      ...session,
    });
  } catch (error) {
    return googleError(res, error);
  }
};

export const session = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "No refresh token provided." });
    }

    const payload = verifyRefreshToken(refreshToken);

    // SECURITY: a refreshed access token must always reflect the account's
    // CURRENT state in the database — never the (possibly stale, possibly
    // forged-then-fixed) claims baked into the refresh token itself. This
    // is also where a deactivated account's session is cut off: it can no
    // longer refresh, so its last access token expires naturally within
    // ACCESS_TOKEN_EXPIRY ("10m") and is never renewed.
    let verifiedRole;
    let verifiedName = payload.name;
    let verifiedEmail = payload.email;
    let verifiedDepartment = payload.department || "General";

    // Single Device Login Logic / Session Validation is evaluated ONLY during refresh
    if (payload.id) {
      const userExists = await User.findById(payload.id).select(
        "currentSessionId role department name email isActive",
      );
      if (
        !userExists ||
        userExists.currentSessionId !== payload.sessionId ||
        userExists.isActive === false
      ) {
        clearRefreshTokenCookie(res);
        return res.status(401).json({
          success: false,
          message: "Session revoked or logged in from another device.",
        });
      }
      verifiedRole = userExists.role;
      verifiedName = userExists.name;
      verifiedEmail = userExists.email;
      verifiedDepartment = userExists.department || "General";
    } else if (payload.role === "admin" && !payload.id) {
      // Pure ENV admin (no DB row). There's no isActive flag to check here —
      // this identity is controlled entirely by the server's own
      // ADMIN_EMAIL/ADMIN_PASSWORD env vars, not by anything in the DB.
      const activeSession = await getAdminSession(payload.email);

      // SECURITY FIX: if there is NO active session record at all (e.g. the
      // ENV admin already logged out, which deletes this record), the old
      // "activeSession && ..." check short-circuited to false and let a
      // stale refresh token silently mint a fresh access token. A missing
      // record must be treated the same as a revoked/mismatched one.
      if (!activeSession || activeSession !== payload.sessionId) {
        clearRefreshTokenCookie(res);
        return res.status(401).json({
          success: false,
          message: "Session revoked or logged in from another device.",
        });
      }
      verifiedRole = "admin";
    } else {
      // Any other shape (no id, and role isn't "admin") is not a session
      // type this app ever legitimately issues — reject outright rather
      // than silently falling through with no validation at all.
      clearRefreshTokenCookie(res);
      return res.status(401).json({
        success: false,
        message: "Invalid session.",
      });
    }

    const newPayload = {
      role: verifiedRole,
      username: payload.username,
      email: verifiedEmail,
      id: payload.id,
      name: verifiedName,
      department: verifiedDepartment,
      sessionId: payload.sessionId, // Keep same session ID to maintain active device tie
    };

    const newAccessToken = createAccessToken(newPayload);

    return res.json({
      success: true,
      token: newAccessToken,
      user: {
        username: payload.username,
        name: verifiedName,
        email: verifiedEmail,
        role: verifiedRole,
        department: verifiedDepartment,
        id: payload.id,
      },
    });
  } catch (error) {
    clearRefreshTokenCookie(res);

    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired refresh token." });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.authUser.id).select("-password");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Dial code (digits) that owns this user's PHONE NUMBER. The phone is the
// source of truth: it is locked and cannot be edited. `countryCode` is only used
// when it really is a prefix of the phone (the schema default "91" is not
// trusted on its own), so the dial is never guessed wrong for older accounts.
const ALL_DIALS = [
  ...new Set(Object.values(COUNTRY_DIAL_CODES).map((c) => c.dial)),
].sort((a, b) => b.length - a.length);

const dialForUser = (user) => {
  const phone = String(user.phone || "").replace(/\D/g, "");
  const candidates = ALL_DIALS.filter((d) => phone.startsWith(d));
  const stored = String(user.countryCode || "").replace(/\D/g, "");
  if (stored && candidates.includes(stored)) return stored;
  return candidates[0] || "";
};

export const updateProfile = async (req, res) => {
  try {
    const { name, company, country } = req.body || {};
    for (const v of [name, company, country]) {
      if (v !== undefined && typeof v !== "string") {
        return res
          .status(400)
          .json({ success: false, message: "Invalid profile data." });
      }
    }
    const user = await User.findById(req.authUser.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

      // Country must belong to the (locked) phone number's country code, so an
    // Indian +91 number cannot be saved as "Australia". Only checked when the
    // country is actually being changed.
    const newCountry = typeof country === "string" ? country.trim() : "";
    if (
      newCountry &&
      newCountry.toLowerCase() !== String(user.country || "").trim().toLowerCase()
    ) {
      const entry = COUNTRY_DIAL_CODES[newCountry.toLowerCase()];
      const dial = dialForUser(user);
      if (!entry) {
        const message = "Please enter a valid country name.";
        return res
          .status(400)
          .json({ success: false, message, fieldErrors: { country: message } });
      }
      if (dial && entry.dial !== dial) {
        const owners = Object.values(COUNTRY_DIAL_CODES)
          .filter((c) => c.dial === dial)
          .map((c) => c.name);
        const message =
          `Country must match your phone number (+${dial}${owners.length ? ` - ${owners.join(" / ")}` : ""}). ` +
          "To use a different country, please contact support to change your phone number.";
        return res
          .status(400)
          .json({ success: false, message, fieldErrors: { country: message } });
      }
      user.country = entry.name; // saved in proper form, e.g. "Australia"
    }

    user.name = name || user.name;
    user.company = company || user.company;
    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        company: user.company,
        country: user.country,
      },
    });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.phone) {
      return res.status(409).json({
        success: false,
        message: "This phone number is already linked to another account.",
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    // Clear the HTTP Only cookie
    clearRefreshTokenCookie(res);

    // SECURITY FIX: this route has no auth middleware in front of it (see
    // authRoutes.js), so `req.authUser` was ALWAYS undefined here — meaning
    // the DB-side session (`currentSessionId` / AdminSession) was NEVER
    // actually revoked on logout, only the browser's cookie was cleared.
    // Anyone holding a copy of the refresh token (stolen cookie, shared
    // machine, a proxy/log, etc.) could keep using it after the user
    // "logged out", since the server never invalidated it.
    //
    // We deliberately read the identity from the REFRESH TOKEN cookie
    // itself rather than requiring a valid Authorization header / adding
    // requireAuth middleware: the access token is only 10 minutes old and
    // is very often already expired by the time someone logs out, but the
    // refresh token (7–30 days) is still live and is the thing that
    // actually needs revoking. A missing/invalid/expired refresh token
    // just means there's nothing left to revoke — logout still succeeds.
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (refreshToken) {
        const payload = verifyRefreshToken(refreshToken);

        if (payload.id) {
          // Detach this device from push for THIS account/session, so a
          // logged-out account never keeps receiving alerts on this device.
          const pushEndpoint =
            typeof req.body?.pushEndpoint === "string"
              ? req.body.pushEndpoint
              : null;
          await PushSubscription.deleteMany({
            userId: payload.id,
            $or: [
              { sessionId: payload.sessionId },
              ...(pushEndpoint ? [{ endpoint: pushEndpoint }] : []),
            ],
          }).catch(() => {});

          // Only clear the session if it's still the SAME session this
          // token belongs to — a stale/old refresh token logging out
          // should never wipe out a newer, currently-active login
          // elsewhere.
          const current = await User.findById(payload.id).select(
            "currentSessionId",
          );
          if (current && current.currentSessionId === payload.sessionId) {
            await User.findByIdAndUpdate(payload.id, {
              currentSessionId: null,
              lastActiveAt: new Date(0),
            });
          }
        } else if (payload.role === "admin" && !payload.id) {
          const pushEndpoint =
            typeof req.body?.pushEndpoint === "string"
              ? req.body.pushEndpoint
              : null;
          await PushSubscription.deleteMany({
            ownerEmail: String(payload.email || "")
              .trim()
              .toLowerCase(),
            $or: [
              { sessionId: payload.sessionId },
              ...(pushEndpoint ? [{ endpoint: pushEndpoint }] : []),
            ],
          }).catch(() => {});

          const activeSession = await getAdminSession(payload.email);
          if (activeSession === payload.sessionId) {
            await deleteAdminSession(payload.email);

            envAdminLastActiveAt = null;
          }
        }
      }
    } catch (sessionCleanupError) {
      // Refresh token missing/invalid/expired/wrong-type: nothing valid to
      // revoke server-side. The cookie is already cleared above, so the
      // browser itself can't use it again either way — proceed as a
      // normal successful logout rather than failing the request.
    }

    return res.json({
      success: true,
      message: "Logged out.",
    });
  } catch (error) {
    return res.json({
      success: true,
      message: "Logged out.",
    });
  }
};

// export const deleteAccount = async (req, res) => {
//   try {
//     const user = await User.findById(req.authUser.id);
//     if (!user)
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });

//     await Inquiry.deleteMany({
//       $or: [{ userId: user._id }, { email: user.email }],
//     });
//     await User.findByIdAndDelete(user._id);

//     return res.json({ success: true, message: "Account deleted." });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ success: false, message: "Failed to delete account." });
//   }
// };

export const deleteAccount = async (req, res) => {
  try {
    // Self-service deletion is for customers. Staff/admin accounts are
    // managed by an admin (DELETE /auth/staff/:id).
    if (req.authUser.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Staff and admin accounts are managed by an administrator.",
      });
    }

    const user = await User.findById(req.authUser.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    // If this account has any orders, we must NOT hard-delete it — every
    // Order document keeps a `userId` pointing at this account, and those
    // orders are also financial/tax records the business needs to keep.
    // Hard-deleting the user would leave those orders pointing at nothing
    // (broken in the admin dashboard, and un-attributable for tax purposes).
    const hasOrders = await Order.exists({ userId: user._id });

    if (hasOrders) {
      // Soft delete: deactivate the account and strip personal info, but
      // keep the document (and therefore every order's userId) intact.
      // email/phone are unique-indexed, so we can't just blank them out —
      // each needs a unique placeholder or the save would fail if this
      // person, or anyone else, is soft-deleted again later.
      user.name = "Deleted User";
      user.email = `deleted-${user._id}@deleted.sanwariyas.local`;
      user.phone = String(parseInt(user._id.toString().slice(-8), 16)).padStart(
        8,
        "0",
      ); // digits-only, derived from this user's own unique ObjectId
      user.company = "";
      user.country = "";
      user.isActive = false; // loginUser() already filters on isActive: true, so this alone blocks login
      user.currentSessionId = null;
      await user.save();

      return res.json({
        success: true,
        message: "Account deleted. Your past orders are kept for our records.",
      });
    }

    // No order history — safe to fully remove, same as before.

    // Only inquiries that belong to THIS account id. Matching by email would
    // also delete other people's guest inquiries that reuse the address.
    const inquiryFilter = { userId: user._id };

    const doomedInquiries = await Inquiry.find(inquiryFilter)
      .select("sampleImages")
      .lean();
    await Inquiry.deleteMany(inquiryFilter);
    await removeStoredInquiryImages(
      doomedInquiries.flatMap((i) => i.sampleImages || []),
    );
    await User.findByIdAndDelete(user._id);

    return res.json({ success: true, message: "Account deleted." });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete account." });
  }
};

export const heartbeat = async (req, res) => {
  try {
    const now = new Date();

    if (req.authUser.id) {
      await User.updateOne(
        { _id: req.authUser.id },
        {
          $set: {
            lastActiveAt: now,
          },
        },
      );
    } else if (req.authUser.role === "admin") {
      envAdminLastActiveAt = now;
    }

    return res.json({
      success: true,
      lastActiveAt: now,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update activity.",
    });
  }
};

export const isAdminCurrentlyOnline = async () => {
  if (envAdminVisible && envAdminLastActiveAt) {
    const diffSeconds = (Date.now() - envAdminLastActiveAt.getTime()) / 1000;
    if (diffSeconds < 120) return true;
  }

  const twoMinsAgo = new Date(Date.now() - 120 * 1000);
  const activeStaff = await User.findOne({
    role: { $in: ["admin", "staff"] },
    isVisible: { $ne: false },
    lastActiveAt: { $gte: twoMinsAgo },
  })
    .select("_id")
    .lean();

  return !!activeStaff;
};

export const toggleVisibility = async (req, res) => {
  try {
    if (req.authUser.role !== "admin" && req.authUser.role !== "staff") {
      return res.status(403).json({ success: false });
    }

    if (req.authUser.id) {
      const user = await User.findByIdAndUpdate(
        req.authUser.id,
        { isVisible: req.body.isVisible },
        { new: true },
      );
      return res.json({ success: true, isVisible: user.isVisible });
    }

    envAdminVisible = !!req.body.isVisible;
    return res.json({ success: true, isVisible: envAdminVisible });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
};

export const getVisibility = async (req, res) => {
  try {
    if (req.authUser.role !== "admin" && req.authUser.role !== "staff") {
      return res.status(403).json({ success: false });
    }

    if (req.authUser.id) {
      const user = await User.findById(req.authUser.id).select("isVisible");
      return res.json({ success: true, isVisible: user.isVisible });
    }

    return res.json({ success: true, isVisible: envAdminVisible });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
};

export const setOffline = async (req, res) => {
  try {
    if (req.authUser.id) {
      await User.findByIdAndUpdate(req.authUser.id, {
        $set: {
          lastActiveAt: new Date(0),
        },
      });
    } else if (req.authUser.role === "admin") {
      envAdminLastActiveAt = null;
    }

    return res.json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to set offline.",
    });
  }
};

export const createStaffAccount = async (req, res) => {
  try {
    if (req.authUser.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only Admin can add staff." });
    }

    const { name, email, phone, password, department } = req.body || {};
    // Strings only: objects/arrays must never reach .trim()/.toLowerCase().
    if (
      ![name, email, phone, password].every(
        (v) => typeof v === "string" && v.trim(),
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled.",
      });
    }

    // Staff are privileged accounts: same strength rules as customer signup.
    const pwErr = validatePassword(password);
    if (pwErr) {
      return res.status(400).json({ success: false, message: pwErr });
    }

    if (department !== undefined && !STAFF_DEPARTMENTS.includes(department)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid department." });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered." });
    }

    const staffUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password, // Pre-save hook hashes password
      role: "staff",
      department: department || "Sales",
      isVerified: true,
      isActive: true,
    });

    await staffUser.save();

    return res.status(201).json({
      success: true,
      message: `Staff account created for ${staffUser.name} (${staffUser.department}).`,
      staff: {
        id: staffUser._id,
        name: staffUser.name,
        email: staffUser.email,
        phone: staffUser.phone,
        department: staffUser.department,
        role: staffUser.role,
        isActive: staffUser.isActive,
      },
    });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.phone) {
      return res.status(409).json({
        success: false,
        message: "This phone number is already registered to another account.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to create staff account.",
    });
  }
};

export const getAllStaff = async (req, res) => {
  try {
    if (req.authUser.role !== "admin" && req.authUser.role !== "staff") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied." });
    }

    const staffMembers = await User.find({ role: { $in: ["staff", "admin"] } })
      // Whitelist: never send password / OTP / reset-token hashes, verify
      // tokens or session ids to (any) staff user.
      .select(
        "name email phone department role isActive lastActiveAt createdAt",
      )
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ success: true, staff: staffMembers });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error. Please try again." });
  }
};

export const updateStaffStatus = async (req, res) => {
  try {
    if (req.authUser.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only Admin can update staff." });
    }

    const { id } = req.params;
    const { isActive, department } = req.body || {};

    // Prevent an admin from locking themselves out.
    if (isActive === false && String(id) === String(req.authUser.id)) {
      return res.status(400).json({
        success: false,
        message: "You cannot deactivate your own account.",
      });
    }
    if (department !== undefined && !STAFF_DEPARTMENTS.includes(department)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid department." });
    }

    const staff = await User.findById(id);

    // SECURITY: this endpoint must only ever modify an actual staff/admin
    // account. Without this check, a customer's account id can be passed
    // here and have its isActive/department fields silently modified
    // through a route that was never meant to touch customer accounts.
    if (!staff || !["staff", "admin"].includes(staff.role))
      return res
        .status(404)
        .json({ success: false, message: "Staff not found." });

    if (isActive !== undefined) staff.isActive = isActive;
    if (department) staff.department = department;

    // SECURITY: deactivating an account must also kill its current
    // session immediately. Without this, a deactivated staff/admin's
    // existing refresh token would keep working (via /auth/session)
    // until it naturally expires in 7 days. Clearing currentSessionId
    // here means the very next /auth/session call for them fails
    // instantly — the only remaining exposure is whatever's left of
    // their already-issued 10-minute access token.
    if (isActive === false) staff.currentSessionId = null;

    await staff.save();

    return res.json({
      success: true,
      message: "Staff updated successfully.",
      staff: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        department: staff.department,
        isActive: staff.isActive,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error. Please try again." });
  }
};

export const deleteStaffAccount = async (req, res) => {
  try {
    if (req.authUser.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only Admin can delete staff." });
    }

    const { id } = req.params;

    if (String(id) === String(req.authUser.id)) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account.",
      });
    }

    // SECURITY: fetch-then-check-then-delete, so this endpoint can never be
    // used to delete a customer account by id. Only an actual staff/admin
    // row may be removed here.
    const staff = await User.findById(id);
    if (!staff || !["staff", "admin"].includes(staff.role)) {
      return res
        .status(404)
        .json({ success: false, message: "Staff not found." });
    }

    await User.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "Staff member removed successfully.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error. Please try again." });
  }
};

// newly added  code

// ═════════════════════════════════════════════════════════════════
// ACCOUNT SECURITY (logged-in customers) + password-reset status
// The user id ALWAYS comes from the verified token (req.authUser.id).
// ═════════════════════════════════════════════════════════════════
const accountError = (res, error) =>
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.statusCode
      ? error.message
      : "Server error. Please try again.",
    ...(error.meta || {}),
  });

const requireCustomerId = (req, res) => {
  if (req.authUser?.role === "customer" && req.authUser.id) {
    return req.authUser.id;
  }
  res
    .status(403)
    .json({ success: false, message: "Customer account required." });
  return null;
};

export const resetStatus = async (req, res) => {
  try {
    const { email } = req.body || {};
    if (typeof email !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Email is required." });
    }
    const status = await authService.getResetStatus(email);
    return res.json({ success: true, ...status });
  } catch (error) {
    return accountError(res, error);
  }
};

export const googleLinkExisting = async (req, res) => {
  try {
    const { linkToken, password } = req.body || {};
    if (typeof linkToken !== "string" || typeof password !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Password is required." });
    }
    const user = await accountService.linkGoogleWithPassword(
      linkToken,
      password,
    );
    const session = await issueCustomerSession(res, user);
    return res.json({ success: true, requires2FA: false, ...session });
  } catch (error) {
    return accountError(res, error);
  }
};

export const googleLinkCurrent = async (req, res) => {
  try {
    const userId = requireCustomerId(req, res);
    if (!userId) return undefined;
    const { credential } = req.body || {};
    if (typeof credential !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Google credential is required." });
    }
    await accountService.linkGoogleToCurrentUser(userId, credential);
    const security = await accountService.getSecurityInfo(userId);
    return res.json({ success: true, message: "Google connected.", security });
  } catch (error) {
    return accountError(res, error);
  }
};

export const getSecurity = async (req, res) => {
  try {
    const userId = requireCustomerId(req, res);
    if (!userId) return undefined;
    const security = await accountService.getSecurityInfo(userId);
    return res.json({ success: true, security });
  } catch (error) {
    return accountError(res, error);
  }
};

export const accountOtpStatus = async (req, res) => {
  try {
    const userId = requireCustomerId(req, res);
    if (!userId) return undefined;
    const status = await accountService.otpStatus(
      userId,
      String(req.query.flow || ""),
      String(req.query.email || ""),
    );
    return res.json({ success: true, ...status });
  } catch (error) {
    return accountError(res, error);
  }
};

export const setPasswordRequest = async (req, res) => {
  try {
    const userId = requireCustomerId(req, res);
    if (!userId) return undefined;
    const result = await accountService.requestSetPassword(userId);
    return res.json({ success: true, ...result });
  } catch (error) {
    return accountError(res, error);
  }
};

export const setPasswordConfirm = async (req, res) => {
  try {
    const userId = requireCustomerId(req, res);
    if (!userId) return undefined;
    const { otp, newPassword, confirmPassword } = req.body || {};
    if (
      typeof otp !== "string" ||
      typeof newPassword !== "string" ||
      typeof confirmPassword !== "string"
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }
    await accountService.confirmSetPassword(
      userId,
      otp,
      newPassword,
      confirmPassword,
    );
    const security = await accountService.getSecurityInfo(userId);
    return res.json({
      success: true,
      message: "Password set. You can now sign in with email and password too.",
      security,
    });
  } catch (error) {
    return accountError(res, error);
  }
};

// export const emailChangeRequest = async (req, res) => {
//   try {
//     const userId = requireCustomerId(req, res);
//     if (!userId) return undefined;
//     const { newEmail } = req.body || {};
//     if (typeof newEmail !== "string") {
//       return res
//         .status(400)
//         .json({ success: false, message: "New email is required." });
//     }
//     const result = await accountService.requestEmailChange(userId, newEmail);
//     return res.json({ success: true, ...result });
//   } catch (error) {
//     return accountError(res, error);
//   }
// };
// export const emailChangeConfirm = async (req, res) => {
//   try {
//     const userId = requireCustomerId(req, res);
//     if (!userId) return undefined;
//     const { otp } = req.body || {};
//     if (typeof otp !== "string") {
//       return res
//         .status(400)
//         .json({ success: false, message: "Code is required." });
//     }
//     const updated = await accountService.confirmEmailChange(userId, otp);
//     const session = await issueCustomerSession(res, updated);
//     return res.json({
//       success: true,
//       message: "Email updated. Your inquiries and orders are unchanged.",
//       ...session,
//     });
//   } catch (error) {
//     return accountError(res, error);
//   }
// };
