//FILE: server/controller/authcontroller

import crypto from "crypto";
import {
  createAuthToken,
  safeCompare,
  verifyAuthToken,
  adminSessionStore,
} from "../utils/authUtils.js";
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
        emailHint,
      });
    }

    // CUSTOMER DIRECT LOGIN (RFC 4122 Standard UUID)
    const sessionId = crypto.randomUUID();

    await User.findByIdAndUpdate(user.id, { currentSessionId: sessionId });

    // Background Inquiry Sync (Fire and Forget)
    Inquiry.updateMany(
      { email: user.email, userId: null },
      { userId: user.id },
    ).catch((err) =>
      console.error(
        "[Background Error] Failed to sync inquiries:",
        err.message,
      ),
    );

    const token = createAuthToken({
      role: user.role,
      id: user.id,
      email: user.email,
      name: user.name,
      sessionId,
    });

    return res.json({
      success: true,
      requires2FA: false,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
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

      // If DB User doesn't exist (Pure ENV Admin), store session in Memory Map
      if (!dbUser) {
        adminSessionStore.set(emailForOtp, sessionId);
      }

      const usernameOutput =
        emailForOtp === adminEmail ? adminUsername : emailForOtp.split("@")[0];
      const token = createAuthToken({
        role,
        id: dbUser ? dbUser._id.toString() : null,
        username: usernameOutput,
        email: emailForOtp,
        sessionId,
      });

      return res.json({
        success: true,
        token,
        user: {
          id: dbUser?._id || null,
          username: usernameOutput,
          email: emailForOtp,
          role,
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
    if (!identifier)
      return res
        .status(400)
        .json({ success: false, message: "Email or phone required." });
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
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return res
        .status(400)
        .json({ success: false, message: "All fields required." });
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
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Authentication required." });

    const payload = verifyAuthToken(token);

    // Hybrid Session Validation
    if (payload.id) {
      const userExists = await User.findById(payload.id).select(
        "currentSessionId",
      );
      if (!userExists || userExists.currentSessionId !== payload.sessionId) {
        return res
          .status(401)
          .json({ success: false, message: "Logged in from another device." });
      }
    } else if (payload.role === "admin" && !payload.id) {
      const activeSession = adminSessionStore.get(payload.email);
      if (activeSession && activeSession !== payload.sessionId) {
        return res
          .status(401)
          .json({ success: false, message: "Logged in from another device." });
      }
    }

    const freshToken = createAuthToken({
      role: payload.role,
      username: payload.username,
      email: payload.email,
      id: payload.id,
      name: payload.name,
      sessionId: payload.sessionId,
    });

    return res.json({
      success: true,
      token: freshToken,
      user: {
        username: payload.username,
        name: payload.name,
        email: payload.email,
        role: payload.role,
        id: payload.id,
      },
    });
  } catch {
    return res
      .status(401)
      .json({ success: false, message: "Invalid session." });
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
    const { name, phone, company, country } = req.body;
    const user = await User.findById(req.authUser.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    user.name = name || user.name;
    user.phone = phone || user.phone;
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
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    if (req.authUser?.id) {
      await User.findByIdAndUpdate(req.authUser.id, { currentSessionId: null });
    } else if (req.authUser?.role === "admin" && !req.authUser?.id) {
      adminSessionStore.delete(req.authUser.email);
    }

    return res.json({ success: true, message: "Logged out." });
  } catch (error) {
    return res.json({ success: true, message: "Logged out." });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.authUser.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    await Inquiry.deleteMany({
      $or: [{ userId: user._id }, { email: user.email }],
    });
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
    if (req.authUser.id) {
      const twoMinsAgo = new Date(Date.now() - 120 * 1000);
      await User.updateOne(
        {
          _id: req.authUser.id,
          $or: [{ lastActiveAt: { $lt: twoMinsAgo } }, { lastActiveAt: null }],
        },
        { $set: { lastActiveAt: new Date() } },
      );
    } else if (req.authUser.role === "admin") {
      envAdminLastActiveAt = new Date();
    }
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
};

// ✅ NAYA — inquiryService.js isse use karega Admin/Staff ka real online status check karne ke liye
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

let envAdminVisible = true;
let envAdminLastActiveAt = null;

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
        lastActiveAt: new Date(0),
      });
    }
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
};
