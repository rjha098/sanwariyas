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

// ✅ FIX: In-Memory Store for Admin Online Status & Visibility
global.adminActivity = global.adminActivity || { lastActiveAt: new Date(0), isVisible: true };

export const customerSignup = async (req, res) => {
  try {
    await authService.signupCustomer(req.body);
    return res
      .status(201)
      .json({
        success: true,
        message: "Account created! Sign in to receive your email OTP.",
      });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({
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
        .json({
          success: false,
          message: "Email/phone and password are required.",
        });

    const adminUsername = (process.env.ADMIN_USERNAME || "admin").trim();
    const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const adminPassword = (process.env.ADMIN_PASSWORD || "").trim();
    const adminPhone = (process.env.ADMIN_PHONE || "")
      .trim()
      .replace(/[\s-]/g, "");

    const id = identifier.trim().toLowerCase();
    const cleanPhoneInput = identifier.trim().replace(/[\s-\+]/g, "");

    const isAdminId =
      safeCompare(id, adminUsername.toLowerCase()) ||
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

    const userExists = await User.findOne({
      $or: [
        { email: id },
        { phone: identifier.trim() },
        { phone: cleanPhoneInput },
        { phone: { $regex: new RegExp(cleanPhoneInput + '$') } }
      ],
    });

    if (!userExists)
      return res
        .status(404)
        .json({
          success: false,
          message: "Account not found. Please create a new account.",
        });

    const customer = await authService.loginCustomer(userExists.email, password);
    
    if (customer)
      return res.json({
        success: true,
        requires2FA: true,
        role: "customer",
        emailHint: customer.emailHint,
        devOtp: customer.devOtp,
      });

    return res
      .status(401)
      .json({
        success: false,
        message: "Incorrect password. Please try again.",
      });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({
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

    const sessionId = crypto.randomBytes(16).toString("hex");

    if (role === "admin") {
      const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
      const adminUsername = (process.env.ADMIN_USERNAME || "admin").trim();

      authService.verifyAdminOtp(adminEmail, otp);

      adminSessionStore.set(adminEmail, sessionId);

      const token = createAuthToken({
        role: "admin",
        username: adminUsername,
        email: adminEmail,
        sessionId,
      });
      return res.json({
        success: true,
        token,
        user: { username: adminUsername, email: adminEmail, role: "admin" },
      });
    }

    if (role === "customer") {
      const customer = await authService.verifyCustomerOtp(identifier, otp);

      await User.findByIdAndUpdate(customer.id, {
        currentSessionId: sessionId,
      });

      const token = createAuthToken({
        role: "customer",
        id: customer.id,
        email: customer.email,
        name: customer.name,
        sessionId,
      });
      return res.json({
        success: true,
        token,
        user: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          role: "customer",
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

export const session = async (req, res) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Authentication required." });

    const payload = verifyAuthToken(token);

    if (payload.role === "admin") {
      const activeSession = adminSessionStore.get(payload.email);
      if (activeSession && activeSession !== payload.sessionId) {
        return res
          .status(401)
          .json({ success: false, message: "Logged in from another device." });
      }
    } else if (payload.role === "customer") {
      const userExists = await User.findById(payload.id);
      if (!userExists || userExists.currentSessionId !== payload.sessionId) {
        return res
          .status(401)
          .json({
            success: false,
            message: "Logged in from another device or account missing.",
          });
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
      .json({ success: false, message: "Invalid or expired session." });
  }
};

export const getMe = async (req, res) => {
  try {
    const userId = req.authUser.id;
    const user = await User.findById(userId).select("-password");
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
    const userId = req.authUser.id;
    const user = await User.findById(userId);

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
    if (req.authUser) {
      if (req.authUser.role === "admin") {
        adminSessionStore.delete(req.authUser.email);
      } else if (req.authUser.role === "customer") {
        await User.findByIdAndUpdate(req.authUser.id, {
          currentSessionId: null,
        });
      }
    }
    return res.json({ success: true, message: "Logged out." });
  } catch (error) {
    return res.json({ success: true, message: "Logged out." }); 
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.authUser.id;
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    await Inquiry.deleteMany({
      $or: [{ userId: userId }, { email: user.email }],
    });
    await User.findByIdAndDelete(userId);

    return res.json({
      success: true,
      message: "Account and all associated data deleted permanently.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to delete account. Please try again later.",
      });
  }
};

// ✅ FIX: ONLINE STATUS APIs (Heartbeat & Toggle)
export const heartbeat = async (req, res) => {
  try {
    if (req.authUser.role === 'admin' || req.authUser.role === 'staff') {
      global.adminActivity.lastActiveAt = new Date();
      return res.json({ success: true, isVisible: global.adminActivity.isVisible });
    } else {
      await User.findByIdAndUpdate(req.authUser.id, { lastActiveAt: new Date() });
      return res.json({ success: true });
    }
  } catch (error) {
    return res.status(500).json({ success: false });
  }
};

export const toggleVisibility = async (req, res) => {
  try {
    if (req.authUser.role === 'admin' || req.authUser.role === 'staff') {
      global.adminActivity.isVisible = req.body.isVisible;
      return res.json({ success: true, isVisible: global.adminActivity.isVisible });
    }
    return res.status(403).json({ success: false });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
};

export const getVisibility = async (req, res) => {
  try {
    if (req.authUser.role === 'admin' || req.authUser.role === 'staff') {
      return res.json({ success: true, isVisible: global.adminActivity.isVisible });
    }
    return res.status(403).json({ success: false });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
};

// ✅ ADDED: Instantly set user offline
export const setOffline = async (req, res) => {
  try {
    if (req.authUser.role === 'admin' || req.authUser.role === 'staff') {
      global.adminActivity.lastActiveAt = new Date(0); // Past date = offline
    } else {
      await User.findByIdAndUpdate(req.authUser.id, { lastActiveAt: new Date(0) });
    }
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
};