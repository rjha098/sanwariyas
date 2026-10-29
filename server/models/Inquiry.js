// // FILE: server/models/Inquiry.js

// import mongoose from "mongoose";

// const replySchema = new mongoose.Schema(
//   {
//     // null for the pure-ENV admin (no User row / no ObjectId)
//     senderId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null,
//     },
//     role: {
//       type: String,
//       enum: ["admin", "staff", "customer"],
//       required: true,
//     },
//     message: { type: String, required: true },
//     isReadByAdmin: { type: Boolean, default: false },
//   },
//   { timestamps: true },
// );

// const inquirySchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null,
//     },
//     // Set when a guest inquiry is attached to an account through the verified
//     // email-code claim flow (null = never claimed / created while logged in).
//     claimedAt: { type: Date, default: null },

//     name: { type: String, required: true, trim: true, maxlength: 120 },
//     companyName: { type: String, required: true, trim: true, maxlength: 150 },
//     email: { type: String, required: true, trim: true, maxlength: 150 },
//     whatsapp: { type: String, required: true, trim: true, maxlength: 20 },
//     country: { type: String, required: true, trim: true, maxlength: 80 },
//     // Optional at schema level so records created before this field existed stay valid.
//     state: { type: String, trim: true, maxlength: 80, default: "" },
//     productCategory: { type: String, trim: true, maxlength: 100 },
//     quantity: { type: Number, min: 1 },
//     budgetRange: { type: String, trim: true, maxlength: 50 },
//     message: { type: String, required: true, trim: true, maxlength: 3000 },

//     // Optional product sample images — relative public paths only, e.g.
//     // "/uploads/inquiries/1730000000000-ab12cd34ef56ab78.jpg" (never binary data)
//     sampleImages: {
//       type: [String],
//       default: [],
//     },

//     product: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Product",
//       default: null,
//     },
//     productName: { type: String, default: "" },
//     status: {
//       type: String,
//       enum: [
//         "pending",
//         "contacted",
//         "resolved",
//         "New",
//         "In Progress",
//         "Quoted",
//         "Closed",
//       ],
//       default: "pending",
//     },
//     replies: [replySchema],
//     isViewedByAdmin: { type: Boolean, default: false },
//     isViewedByUser: { type: Boolean, default: true },
//     adminNotes: { type: String, default: "" },
//   },
//   { timestamps: true },
// );

// inquirySchema.index({ status: 1 });
// // getUserInquiries(): { $or: [{ userId }, { email, whatsapp }] } sorted by newest
// inquirySchema.index({ userId: 1, createdAt: -1 });
// inquirySchema.index({ email: 1, whatsapp: 1 });
// // admin list sorted by newest
// inquirySchema.index({ createdAt: -1 });

// export default mongoose.model("Inquiry", inquirySchema);


// FILE: server/models/Inquiry.js

import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    // null for the pure-ENV admin (no User row / no ObjectId)
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
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

// Private admin-only call/chat log. NEVER shown to customers: the parent fields
// below are `select: false`, so no customer-facing query returns them unless a
// query explicitly asks with .select("+contactLogs ...") (admin code only).
export const CONTACT_CHANNELS = [
  "whatsapp",
  "call",
  "email",
  "meeting",
  "other",
];

const contactLogSchema = new mongoose.Schema(
  {
    note: { type: String, required: true, trim: true, maxlength: 3000 },
    channel: { type: String, enum: CONTACT_CHANNELS, default: "whatsapp" },
    // Optional reminder: "call him again on ..."
    followUpAt: { type: Date, default: null },
    // Who wrote it (admin email / name from the token)
    createdBy: { type: String, default: "admin", maxlength: 150 },
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
    // Optional at schema level so records created before this field existed stay valid.
    state: { type: String, trim: true, maxlength: 80, default: "" },
    productCategory: { type: String, trim: true, maxlength: 100 },
    quantity: { type: Number, min: 1 },
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
    // Admin-only fields (select:false => hidden from every customer response).
    adminNotes: { type: String, default: "", select: false },
    contactLogs: { type: [contactLogSchema], default: [], select: false },
    lastContactedAt: { type: Date, default: null, select: false },
    nextFollowUpAt: { type: Date, default: null, select: false },
  },
  { timestamps: true },
);

inquirySchema.index({ status: 1 });
// getUserInquiries(): { $or: [{ userId }, { email, whatsapp }] } sorted by newest
inquirySchema.index({ userId: 1, createdAt: -1 });
inquirySchema.index({ email: 1, whatsapp: 1 });
// admin list sorted by newest
inquirySchema.index({ createdAt: -1 });
// follow-up reminders ("due / overdue" count on the admin list)
inquirySchema.index({ nextFollowUpAt: 1 });

export default mongoose.model("Inquiry", inquirySchema);
