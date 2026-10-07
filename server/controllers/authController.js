// FILE: server/controllers/authController.js
//usage --->>>>  controllers/authController.js & services/authService.js: Handles the heavy lifting of user identity. It processes customer signups, issues HTTP-only cookies, triggers Resend OTP emails for staff/admin 2FA, and seamlessly merges old "guest" inquiries into new accounts based on matching phone/email data.

import crypto from "crypto";

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
    const { identifier, password } = req.body;
    if (!identifier || !password)
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

    // Background Inquiry Sync (Fire and Forget)
    // Matches only when BOTH email AND phone (whatsapp) are the exact same
    // — a single matching field is not enough, to avoid linking someone
    // else's inquiry just because a number or email was reused.

    Inquiry.updateMany(
      {
        userId: null,
        email: user.email,
        whatsapp: user.phone,
      },
      { userId: user.id },
    ).catch((err) => {
      // console.error("[Background Error] Failed to sync inquiries:", err.message);
    });

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
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error during login.",
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
        role,
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
          role,
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
    const { identifier } = req.body;

    if (!identifier || typeof identifier !== "string")
      return res
        .status(400)
        .json({ success: false, message: "Email address required." });

    const result = await authService.initiateForgotPassword(identifier);
    return res.json({ success: true, ...result });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message || "Server error." });
  }
};

export const resetPassword = async (req, res) => {
  try {
    // resetPassword function mein
    const { email, otp, newPassword } = req.body;

    // Strict string check taaki hacker object/code na bhej sake
    if (
      !email ||
      !otp ||
      !newPassword ||
      typeof email !== "string" ||
      typeof otp !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields required and must be valid text.",
      });
    }

    await authService.resetUserPassword(email, otp, newPassword);

    return res.json({
      success: true,
      message: "Password updated safely. You can now sign in.",
    });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message || "Server error." });
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

    // Single Device Login Logic / Session Validation is evaluated ONLY during refresh
    if (payload.id) {
      const userExists = await User.findById(payload.id).select(
        "currentSessionId role department name email",
      );
      if (!userExists || userExists.currentSessionId !== payload.sessionId) {
        clearRefreshTokenCookie(res);
        return res.status(401).json({
          success: false,
          message: "Session revoked or logged in from another device.",
        });
      }
    } else if (payload.role === "admin" && !payload.id) {
      const activeSession = await getAdminSession(payload.email);

      if (activeSession && activeSession !== payload.sessionId) {
        clearRefreshTokenCookie(res);
        return res.status(401).json({
          success: false,
          message: "Session revoked or logged in from another device.",
        });
      }
    }

    const newPayload = {
      role: payload.role,
      username: payload.username,
      email: payload.email,
      id: payload.id,
      name: payload.name,
      department: payload.department || "General",
      sessionId: payload.sessionId, // Keep same session ID to maintain active device tie
    };

    const newAccessToken = createAccessToken(newPayload);

    return res.json({
      success: true,
      token: newAccessToken,
      user: {
        username: payload.username,
        name: payload.name,
        email: payload.email,
        role: payload.role,
        department: payload.department || "General",
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

export const updateProfile = async (req, res) => {
  try {
    const { name, company, country } = req.body;
    const user = await User.findById(req.authUser.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    user.name = name || user.name;
    user.company = company || user.company;
    user.country = country || user.country;
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

    // Ensure backend knows it's clearing the DB session if token was still valid
    if (req.authUser?.id) {
      await User.findByIdAndUpdate(req.authUser.id, {
        currentSessionId: null,
        lastActiveAt: new Date(0),
      });
    } else if (req.authUser?.role === "admin" && !req.authUser?.id) {
      await deleteAdminSession(req.authUser.email);
      envAdminLastActiveAt = null;
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

        const inquiryFilter = {
      $or: [{ userId: user._id }, { email: user.email }],
    };
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

    const { name, email, phone, password, department } = req.body;
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled.",
      });
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
      message: error.message || "Failed to create staff account.",
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
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ success: true, staff: staffMembers });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
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
    const { isActive, department } = req.body;

    const staff = await User.findById(id);
    if (!staff)
      return res
        .status(404)
        .json({ success: false, message: "Staff not found." });

    if (isActive !== undefined) staff.isActive = isActive;
    if (department) staff.department = department;

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
    return res.status(500).json({ success: false, message: error.message });
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
    await User.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "Staff member removed successfully.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
