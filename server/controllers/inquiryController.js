// FILE: server/controllers/inquiryController.js

import mongoose from "mongoose";
import * as inquiryService from "../services/inquiryService.js";
import User from "../models/User.js";
import Inquiry from "../models/Inquiry.js";
import { verifyAccessToken } from "../utils/authUtils.js";
import {
  requestInquiryClaim,
  confirmInquiryClaim,
} from "../services/inquiryClaimService.js";
import {
  removeUploadedFiles,
  toPublicPath,
} from "../middlewares/inquiryUpload.js";

const isObjectId = (id) => typeof id === "string" && /^[a-f\d]{24}$/i.test(id);
const rejectBadId = (res) =>
  res.status(400).json({ success: false, message: "Invalid inquiry id." });
const MAX_REPLY_LENGTH = 5000;

export const submitInquiry = async (req, res) => {
  // Built ONLY from req.files (Multer) — req.body.sampleImages is never trusted.
  const uploadedFiles = Array.isArray(req.files) ? req.files : [];
  const sampleImages = uploadedFiles.map((file) => toPublicPath(file.filename));

  try {
    let userId = null;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      try {
        const decoded = verifyAccessToken(token);
        const candidate = decoded.id || decoded._id || decoded.userId;
        // Owner id comes ONLY from a verified customer token (never from the
        // request body); admin/staff tokens leave the inquiry unclaimed.
        if (
          decoded.role === "customer" &&
          /^[a-f\d]{24}$/i.test(String(candidate))
        ) {
          userId = candidate;
        }
      } catch (err) {
        // console.log("Invalid token, proceeding as guest.");
      }
    }

    const inquiry = await inquiryService.createInquiry(
      req.body,
      userId,
      sampleImages,
    );
    res.status(201).json({ success: true, inquiry });
  } catch (error) {
    // Inquiry was not saved -> don't leave the uploaded files orphaned on disk.
    // createInquiry also sends a notification/email AFTER saving, so first make
    // sure the inquiry really doesn't exist; if the check itself fails, keep the
    // files (an orphan file is better than an inquiry pointing at a deleted one).
    if (uploadedFiles.length > 0) {
      let inquirySaved = true;
      try {
        inquirySaved = !!(await Inquiry.exists({
          sampleImages: { $in: sampleImages },
        }));
      } catch (checkError) {
        // keep files
      }
      if (!inquirySaved) await removeUploadedFiles(uploadedFiles);
    }

    res
      .status(Number.isInteger(error.status) ? error.status : 500)
      .json({ success: false, message: error.message });
  }
};

export const getInquiries = async (req, res) => {
  try {
    // MINOR FIX: Admin request par limit cap (max 100)
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);

    const data = await inquiryService.getAllInquiries({
      ...req.query,
      page,
      limit,
    });
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyInquiries = async (req, res) => {
  try {
    const userId =
      req.authUser?.id || req.authUser?._id || req.authUser?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login.",
      });
    }

    // Only inquiries attached to THIS account id (see inquiryService).
    const { inquiries, pagination } = await inquiryService.getUserInquiriesPage(
      userId,
      { page: req.query?.page, limit: req.query?.limit },
    );
    return res.json({ success: true, inquiries, pagination });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load your inquiries.",
    });
  }
};

export const updateStatus = async (req, res) => {
  if (!isObjectId(req.params.id)) return rejectBadId(res);
  try {
    const inquiry = await inquiryService.updateInquiryStatus(
      req.params.id,
      req.body,
    );
    res.json({ success: true, inquiry });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message });
  }
};

export const replyToInquiry = async (req, res) => {
  if (!isObjectId(req.params.id)) return rejectBadId(res);
  try {
    const userObj = req.authUser || {};
    const senderId = userObj.id || userObj._id || userObj.userId;
    const role = userObj.role;

    // The pure-ENV admin has no database id, so only they may reply without one.
    if (!role || (!senderId && role !== "admin")) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized. Please login." });
    }

    //  Ownership check for customers
    if (role === "customer") {
      const owned = await inquiryService.isInquiryOwnedByUser(
        req.params.id,
        senderId,
      );
      if (!owned) {
        return res.status(403).json({
          success: false,
          message: "You do not have access to this inquiry.",
        });
      }
    }

    const message =
      typeof req.body?.message === "string" ? req.body.message.trim() : "";
    if (!message || message.length > MAX_REPLY_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Reply must be between 1 and ${MAX_REPLY_LENGTH} characters.`,
      });
    }
    const inquiry = await inquiryService.addReplyToInquiry(
      req.params.id,
      senderId,
      role,
      message,
    );
    res.json({ success: true, inquiry });
  } catch (error) {
    console.error("Reply Error:", error);
    res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message });
  }
};

export const markViewed = async (req, res) => {
  if (!isObjectId(req.params.id)) return rejectBadId(res);
  try {
    const { role, id, email } = req.authUser;

    // Ownership check for customers
    if (role === "customer") {
      const owned = await inquiryService.isInquiryOwnedByUser(
        req.params.id,
        id,
      );

      if (!owned) {
        return res.status(403).json({
          success: false,
          message: "You do not have access to this inquiry.",
        });
      }
    }

    const inquiry = await inquiryService.markInquiryAsViewed(
      req.params.id,
      role,
    );

    res.json({
      success: true,
      inquiry,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSingleInquiry = async (req, res) => {
  if (!isObjectId(req.params.id)) return rejectBadId(res);
  try {
    const inquiry = await inquiryService.getInquiryById(req.params.id);
    res.json({ success: true, inquiry });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message });
  }
};

export const deleteInquiry = async (req, res) => {
  if (!isObjectId(req.params.id)) return rejectBadId(res);
  try {
    await inquiryService.deleteInquiryById(req.params.id);
    res.json({ success: true, message: "Inquiry deleted successfully" });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message });
  }
};

// ── Claim earlier GUEST inquiries (verified by an emailed code) ──────────
const claimError = (res, error) =>
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.statusCode
      ? error.message
      : "Server error. Please try again.",
    ...(error.meta || {}),
  });

const customerId = (req) =>
  req.authUser?.role === "customer" ? req.authUser.id : null;

export const claimRequest = async (req, res) => {
  try {
    const userId = customerId(req);
    if (!userId) {
      return res
        .status(403)
        .json({ success: false, message: "Customer account required." });
    }
    const result = await requestInquiryClaim(userId);
    return res.json({ success: true, ...result });
  } catch (error) {
    return claimError(res, error);
  }
};

export const claimConfirm = async (req, res) => {
  try {
    const userId = customerId(req);
    if (!userId) {
      return res
        .status(403)
        .json({ success: false, message: "Customer account required." });
    }
    const { otp } = req.body || {};
    if (typeof otp !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Code is required." });
    }
    const result = await confirmInquiryClaim(userId, otp);
    return res.json({
      success: true,
      message:
        result.claimed > 0
          ? `${result.claimed} inquiry(ies) added to your account.`
          : "No unclaimed inquiries were found for this email.",
      ...result,
    });
  } catch (error) {
    return claimError(res, error);
  }
};
