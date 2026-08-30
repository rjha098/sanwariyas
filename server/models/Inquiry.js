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

    name: { type: String, required: true, trim: true, maxlength: 120 },
    companyName: { type: String, required: true, trim: true, maxlength: 150 },
    email: { type: String, required: true, trim: true, maxlength: 150 },
    whatsapp: { type: String, required: true, trim: true, maxlength: 20 },
    country: { type: String, required: true, trim: true, maxlength: 80 },
    productCategory: { type: String, trim: true, maxlength: 100 },
    budgetRange: { type: String, trim: true, maxlength: 50 },
    message: { type: String, required: true, trim: true, maxlength: 3000 },

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

export default mongoose.model("Inquiry", inquirySchema);
