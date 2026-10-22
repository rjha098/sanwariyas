// FILE: server/models/Inquiry.js

import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "staff", "customer"],
      required: true,
    },
    message: { type: String, required: true },
    isReadByAdmin: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const inquirySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    // Set when a guest inquiry is attached to an account through the verified
    // email-code claim flow (null = never claimed / created while logged in).
    claimedAt: { type: Date, default: null },

    name: { type: String, required: true, trim: true, maxlength: 120 },
    companyName: { type: String, required: true, trim: true, maxlength: 150 },
    email: { type: String, required: true, trim: true, maxlength: 150 },
    whatsapp: { type: String, required: true, trim: true, maxlength: 20 },
    country: { type: String, required: true, trim: true, maxlength: 80 },
    productCategory: { type: String, trim: true, maxlength: 100 },
    budgetRange: { type: String, trim: true, maxlength: 50 },
    message: { type: String, required: true, trim: true, maxlength: 3000 },

    // Optional product sample images — relative public paths only, e.g.
    // "/uploads/inquiries/1730000000000-ab12cd34ef56ab78.jpg" (never binary data)
    sampleImages: {
      type: [String],
      default: [],
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },
    productName: { type: String, default: "" },
    status: {
      type: String,
      enum: [
        "pending",
        "contacted",
        "resolved",
        "New",
        "In Progress",
        "Quoted",
        "Closed",
      ],
      default: "pending",
    },
    replies: [replySchema],
    isViewedByAdmin: { type: Boolean, default: false },
    isViewedByUser: { type: Boolean, default: true },
    adminNotes: { type: String, default: "" },
  },
  { timestamps: true },
);

inquirySchema.index({ status: 1 });
// getUserInquiries(): { $or: [{ userId }, { email, whatsapp }] } sorted by newest
inquirySchema.index({ userId: 1, createdAt: -1 });
inquirySchema.index({ email: 1, whatsapp: 1 });
// admin list sorted by newest
inquirySchema.index({ createdAt: -1 });

export default mongoose.model("Inquiry", inquirySchema);