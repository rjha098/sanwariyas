// FILE: server/models/LookbookInquiry.js
// Inquiries sent from the Lookbook magazine. Completely separate from the
// normal website "Inquiry" collection — nothing here touches that module.
import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    lookbookId: { type: mongoose.Schema.Types.ObjectId },
    styleNumber: { type: String, default: "" },
    title: { type: String, default: "" },
    category: { type: String, default: "" },
    image: { type: String, default: "" },
  },
  { _id: false },
);

const answerSchema = new mongoose.Schema(
  {
    question: { type: String, default: "" },
    answer: { type: [String], default: [] },
  },
  { _id: false },
);

const lookbookInquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    companyName: { type: String, required: true, trim: true, maxlength: 150 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 150,
    },
    whatsapp: { type: String, required: true, trim: true, maxlength: 30 },
    country: { type: String, required: true, trim: true, maxlength: 80 },
    // Optional at schema level so records created before this field existed stay valid.
    state: { type: String, trim: true, maxlength: 80, default: "" },
    note: { type: String, trim: true, maxlength: 1500, default: "" },
    items: { type: [itemSchema], default: [] },
    answers: { type: [answerSchema], default: [] },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
    },
  },
  { timestamps: true },
);

lookbookInquirySchema.index({ createdAt: -1 });
lookbookInquirySchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("LookbookInquiry", lookbookInquirySchema);
