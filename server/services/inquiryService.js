// // FILE: server/services/inquiryService.js

// import { escapeHtml } from "../utils/escapeHtml.js";
// import { isAdminCurrentlyOnline } from "../controllers/authController.js";
// import Inquiry from "../models/Inquiry.js";
// import Notification from "../models/Notification.js";
// import User from "../models/User.js";
// import { Resend } from "resend";

// import { normalizeEmail, normalizePhone } from "../utils/normalize.js";
// import { removeStoredInquiryImages } from "../middlewares/inquiryUpload.js";
// import { formatPhone } from "../utils/formatPhone.js";
// import { validateState } from "../utils/validateState.js";

// const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "hrsanwariyas@gmail.com";

// const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// const OBJECT_ID_RE = /^[a-f\d]{24}$/i;
// const badRequest = (message) => {
//   const err = new Error(message);
//   err.status = 400;
//   return err;
// };
// const asText = (v) => (typeof v === "string" ? v.trim() : null);

// export const validateInquiryInput = (data = {}) => {
//   const required = [
//     ["name", 120, "Name"],
//     ["companyName", 150, "Company name"],
//     ["country", 80, "Country"],
//     ["message", 3000, "Message"],
//   ];
//   for (const [key, max, label] of required) {
//     const v = asText(data[key]);
//     if (!v) throw badRequest(`${label} is required.`);
//     if (v.length > max)
//       throw badRequest(`${label} must be ${max} characters or fewer.`);
//   }
//   const email = asText(data.email);
//   if (!email || email.length > 150 || !EMAIL_RE.test(email)) {
//     throw badRequest("Please enter a valid email address.");
//   }
//   const digits =
//     typeof data.whatsapp === "string" || typeof data.whatsapp === "number"
//       ? normalizePhone(data.whatsapp)
//       : "";
//   if (digits.length < 7 || digits.length > 20) {
//     throw badRequest("Please enter a valid WhatsApp number.");
//   }
//   for (const [key, max] of [
//     ["productCategory", 100],
//     ["budgetRange", 50],
//   ]) {
//     const v = data[key];
//     if (v !== undefined && v !== null && v !== "") {
//       if (typeof v !== "string" || v.trim().length > max)
//         throw badRequest(`Invalid ${key}.`);
//     }
//   }
//   if (
//     data.quantity !== undefined &&
//     data.quantity !== null &&
//     data.quantity !== ""
//   ) {
//     const q = Number(data.quantity);
//     if (!Number.isFinite(q) || q < 10 || q > 1e9)
//       throw badRequest("Minimum order quantity is 10 pieces.");
//   }
//   if (
//     data.productId &&
//     !(typeof data.productId === "string" && OBJECT_ID_RE.test(data.productId))
//   ) {
//     throw badRequest("Invalid product.");
//   }
// };

// const STATUS_ALIASES = {
//   pending: ["pending", "New"],
//   contacted: ["contacted", "In Progress", "Quoted"],
//   resolved: ["resolved", "Closed"],
// };

// const aliasesFor = (status) =>
//   typeof status === "string" && Object.hasOwn(STATUS_ALIASES, status)
//     ? STATUS_ALIASES[status]
//     : null;

// const DUPLICATE_WINDOW_MS = 60 * 1000;
// const inflightInquiries = new Map();

// export const createInquiry = async (data, userId, sampleImages = []) => {
//   validateInquiryInput(data);
//   const email = data.email ? normalizeEmail(data.email) : "";
//   const whatsapp = normalizePhone(data.whatsapp);
//   const message = String(data.message).trim();
//   const key = [
//     userId || "guest",
//     email,
//     whatsapp,
//     message,
//     data.productCategory || "",
//     data.quantity || "",
//   ].join("\u0001");
//   const discard = () => removeStoredInquiryImages(sampleImages).catch(() => {});

//   if (inflightInquiries.has(key)) {
//     const first = await inflightInquiries.get(key);
//     await discard();
//     return first;
//   }
//   const work = (async () => {
//     const recent = await Inquiry.findOne({
//       userId: userId || null,
//       email,
//       whatsapp,
//       message,
//       createdAt: { $gte: new Date(Date.now() - DUPLICATE_WINDOW_MS) },
//     })
//       .sort({ createdAt: -1 })
//       .lean();
//     if (recent) {
//       await discard();
//       return recent;
//     }
//     return createInquiryCore(data, userId, sampleImages);
//   })();
//   inflightInquiries.set(key, work);
//   try {
//     return await work;
//   } finally {
//     inflightInquiries.delete(key);
//   }
// };

// const createInquiryCore = async (data, userId, sampleImages = []) => {
//   validateInquiryInput(data);
//   const checkedState = validateState(data.state);
//   if (checkedState.error) {
//     const err = new Error(checkedState.error);
//     err.status = 400;
//     throw err;
//   }
//   const inquiry = await Inquiry.create({
//     name: data.name,
//     companyName: data.companyName,
//     email: data.email ? normalizeEmail(data.email) : "",
//     whatsapp: normalizePhone(data.whatsapp),
//     country: data.country,
//     state: checkedState.value,
//     productCategory: data.productCategory,
//     quantity: data.quantity,
//     budgetRange: data.budgetRange,
//     message: data.message,
//     sampleImages,
//     userId: userId || null,
//     product: data.productId || null,
//     productName: data.productName || "",
//     status: "pending",
//     isViewedByAdmin: false,
//     isViewedByUser: true,
//   });

//   await Notification.create({
//     isGlobalAdmin: true,
//     type: "new_inquiry",
//     title: "New Wholesale Inquiry",
//     message: `New inquiry received from ${data.companyName || data.name}.`,
//     relatedInquiryId: inquiry._id,
//     link: `/operations-center/inquiries/${inquiry._id}`,
//   });

//   if (process.env.RESEND_API_KEY) {
//     try {
//       const resend = new Resend(process.env.RESEND_API_KEY);
//       await resend.emails.send({
//         from:
//           process.env.RESEND_FROM_EMAIL ||
//           "Sanwariyas System <onboarding@resend.dev>",
//         to: ADMIN_EMAIL,
//         subject: `🔥 New Wholesale Inquiry from ${data.name}`,
//         html: `
//           <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
//             <h2 style="color: #7A3D2A;">New Wholesale Inquiry Received</h2>
//            <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
//             <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
//             <p><strong>WhatsApp:</strong> ${escapeHtml(data.whatsapp ? formatPhone(data.whatsapp) : "Not provided")}</p>
//             <p><strong>Company:</strong> ${escapeHtml(data.companyName || "Not provided")}</p>
//             <p><strong>State:</strong> ${escapeHtml(checkedState.value)}</p>
//             <p><strong>Category:</strong> ${escapeHtml(data.productCategory || "Not provided")}</p>
//             <hr style="border: 1px solid #E0BFA2; margin: 20px 0;">
//             <h3>Message:</h3>
//             <p style="background: #FDF7F2; padding: 15px; border-left: 4px solid #7A3D2A;">
//               ${escapeHtml(data.message || "No additional message.")}
//             </p>
//           </div>
//         `,
//       });
//     } catch (emailError) {
//       console.error("❌ Failed to send admin email:", emailError.message);
//     }
//   }

//   return inquiry;
// };

// export const getAllInquiries = async ({ page = 1, limit = 20, status }) => {
//   const query = {};
//   if (typeof status === "string" && status && status !== "all") {
//     query.status = { $in: aliasesFor(status) || [status] };
//   }

//   const skip = (parseInt(page) - 1) * parseInt(limit);
//   const total = await Inquiry.countDocuments(query);

//   const inquiries = await Inquiry.find(query)
//     .populate("product", "name slug")
//     .sort({ createdAt: -1 })
//     .skip(skip)
//     .limit(parseInt(limit))
//     .lean();

//   const totalPending = await Inquiry.countDocuments({
//     status: { $in: STATUS_ALIASES["pending"] },
//   });
//   const totalResolved = await Inquiry.countDocuments({
//     status: { $in: STATUS_ALIASES["resolved"] },
//   });

//   const isAdminOnline = await isAdminCurrentlyOnline();

//   //  ADDED: Attach Customer Online Status in bulk
//   const userIds = inquiries.map((i) => i.userId).filter((id) => id);
//   const activeUsers = await User.find({ _id: { $in: userIds } })
//     .select("_id lastActiveAt")
//     .lean();

//   const activeMap = {};
//   activeUsers.forEach((u) => {
//     if (u.lastActiveAt) {
//       const diff = (new Date() - new Date(u.lastActiveAt)) / 1000;
//       if (diff < 120) {
//         activeMap[u._id.toString()] = true;
//       }
//     }
//   });

//   const enrichedInquiries = inquiries.map((inq) => {
//     let isCustomerOnline = false;
//     if (inq.userId && activeMap[inq.userId.toString()]) isCustomerOnline = true;
//     return { ...inq, isAdminOnline, isCustomerOnline };
//   });

//   return {
//     inquiries: enrichedInquiries, //  Replaced 'inquiries' with 'enrichedInquiries'
//     pagination: {
//       total,
//       page: parseInt(page),
//       limit: parseInt(limit),
//       pages: Math.ceil(total / parseInt(limit)),
//     },
//     stats: { pending: totalPending, resolved: totalResolved },
//   };
// };

// // Ownership is the permanent account id ONLY. Matching email/phone is never
// // enough (that let a new registration read someone else's guest inquiries);
// // guest inquiries join an account through the verified claim flow
// // (inquiryClaimService.js), which sets userId.

// export const getUserInquiriesPage = async (userId, { page, limit } = {}) => {
//   const p = Math.max(1, parseInt(page, 10) || 1);
//   const l = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
//   const [rows, total] = await Promise.all([
//     Inquiry.find({ userId }).sort({ createdAt: -1 }).skip((p - 1) * l).limit(l).lean(),
//     Inquiry.countDocuments({ userId }),
//   ]);
//   const isAdminOnline = await isAdminCurrentlyOnline();
//   return {
//     inquiries: rows.map((inq) => ({ ...inq, isAdminOnline })),
//     pagination: { total, page: p, limit: l, pages: Math.ceil(total / l) },
//   };
// };

// export const getUserInquiries = async (userId) =>
//   (await getUserInquiriesPage(userId)).inquiries;

// export const getInquiryById = async (id) => {
//   const inquiry = await Inquiry.findById(id)
//     .populate("product", "name slug")
//     .lean();

//   if (!inquiry) {
//     const error = new Error("Inquiry not found");
//     error.statusCode = 404;
//     throw error;
//   }

//   // ✅ Evaluate Customer Online Status
//   let isCustomerOnline = false;
//   let userObj = null;
//   if (inquiry.userId) {
//     userObj = await User.findById(inquiry.userId).select("lastActiveAt").lean();
//   }

//   if (userObj && userObj.lastActiveAt) {
//     const diffSeconds = (new Date() - new Date(userObj.lastActiveAt)) / 1000;
//     if (diffSeconds < 120) isCustomerOnline = true;
//   }
//   inquiry.isCustomerOnline = isCustomerOnline;

//   // Evaluate Admin Online Status
//   inquiry.isAdminOnline = await isAdminCurrentlyOnline();

//   return inquiry;
// };

// export const updateInquiryStatus = async (id, { status, adminNotes }) => {
//   if (status && !aliasesFor(status)) {
//     const err = new Error("Invalid inquiry status");
//     err.statusCode = 400;
//     throw err;
//   }
//   const update = {};
//   if (status) update.status = status;
//   if (adminNotes !== undefined) update.adminNotes = adminNotes;

//   const inquiry = await Inquiry.findByIdAndUpdate(id, update, {
//     new: true,
//   }).lean();

//   if (!inquiry) {
//     const error = new Error("Inquiry not found");
//     error.statusCode = 404;
//     throw error;
//   }

//   return inquiry;
// };

// export const addReplyToInquiry = async (id, senderId, role, message) => {
//   const inquiry = await Inquiry.findById(id);

//   if (!inquiry) {
//     const error = new Error("Inquiry not found");
//     error.statusCode = 404;
//     throw error;
//   }

//   inquiry.replies.push({
//     senderId,
//     role,
//     message,
//     isReadByAdmin: role === "customer" ? false : true,
//   });

//   if (role === "admin" || role === "staff") {
//     inquiry.isViewedByUser = false;
//     if (inquiry.status === "pending") inquiry.status = "contacted";

//     if (inquiry.userId) {
//       await Notification.create({
//         recipientId: inquiry.userId,
//         type: "inquiry_reply",
//         title: "New Reply on Your Inquiry",
//         message: `Sanwariyas has replied to your inquiry regarding ${inquiry.productCategory}.`,
//         relatedInquiryId: inquiry._id,
//         link: `/my-inquiries/${inquiry._id}`,
//       });
//     }

//     if (process.env.RESEND_API_KEY && inquiry.email) {
//       try {
//         const resend = new Resend(process.env.RESEND_API_KEY);
//         await resend.emails.send({
//           from:
//             process.env.RESEND_FROM_EMAIL ||
//             "Sanwariyas Updates <onboarding@resend.dev>",
//           to: inquiry.email,
//           subject: `Update on your Sanwariyas Inquiry`,
//           html: `
//             <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
//               <p>Hello ${escapeHtml(inquiry.name)},</p>
//               <p>We have replied to your inquiry regarding <strong>${escapeHtml(inquiry.productCategory)}</strong>.</p>
//               <p style="background: #FDF7F2; padding: 15px; border-left: 4px solid #7A3D2A;">
//                 <strong>Admin Reply:</strong><br/><br/>
//                 ${escapeHtml(message)}
//               </p>
//               <p>Please log in to your dashboard to continue the conversation.</p>
//             </div>
//            `,
//         });
//       } catch (e) {
//         console.error("❌ Customer reply email failed:", e.message);
//       }
//     }
//   } else {
//     inquiry.isViewedByAdmin = false;
//     await Notification.create({
//       isGlobalAdmin: true,
//       type: "inquiry_reply",
//       title: "Customer Replied",
//       message: `${inquiry.companyName || inquiry.name} replied to their inquiry.`,
//       relatedInquiryId: inquiry._id,
//       link: `/operations-center/inquiries/${inquiry._id}`,
//     });
//   }

//   await inquiry.save();
//   return inquiry;
// };

// export const markInquiryAsViewed = async (id, role) => {
//   if (role === "customer") {
//     const inquiry = await Inquiry.findByIdAndUpdate(
//       id,
//       { isViewedByUser: true },
//       { new: true },
//     );

//     if (inquiry && inquiry.userId) {
//       // customer can  see the  inquiry reply
//       // delete  this inquiry  related notification
//       // NOTE: scoped strictly to this customer's own notifications
//       // (isGlobalAdmin: false) so a guest/null userId can never collide
//       // with the admin's isGlobalAdmin notifications, which also default
//       // to recipientId: null.

//       await Notification.deleteMany({
//         recipientId: inquiry.userId,
//         relatedInquiryId: inquiry._id,
//         isGlobalAdmin: false,
//       });
//     }

//     return inquiry;
//   } else {
//     const inquiry = await Inquiry.findById(id);

//     if (!inquiry) {
//       const error = new Error("Inquiry not found");
//       error.statusCode = 404;
//       throw error;
//     }

//     // Mark all customer replies as read
//     inquiry.replies = inquiry.replies.map((reply) => {
//       if (reply.role === "customer") {
//         reply.isReadByAdmin = true;
//       }
//       return reply;
//     });

//     inquiry.isViewedByAdmin = true;

//     await inquiry.save();

//     // Admin/Staff  can  see  the  inquiry
//     // delete  this  inquiry  related notification
//     // NOTE: scoped strictly to isGlobalAdmin: true so this never touches
//     // the customer's own recipientId-based notification for the same
//     // inquiry (e.g. the "New Reply" notification just created above).

//     await Notification.deleteMany({
//       isGlobalAdmin: true,
//       relatedInquiryId: inquiry._id,
//     });

//     return inquiry;
//   }
// };

// export const deleteInquiryById = async (id) => {
//   const inquiry = await Inquiry.findByIdAndDelete(id);

//   if (!inquiry) {
//     const error = new Error("Inquiry not found");
//     error.statusCode = 404;
//     throw error;
//   }

//   await Notification.deleteMany({ relatedInquiryId: id });

//   // DB record gone — also remove its uploaded images from disk.
//   await removeStoredInquiryImages(inquiry.sampleImages);

//   return inquiry;
// };

// // server/services/inquiryService.js — add this helper, use it in markInquiryAsViewed too

// export const isInquiryOwnedByUser = async (id, userId) => {
//   if (!userId) return false;
//   const inquiry = await Inquiry.findById(id).select("userId").lean();
//   if (!inquiry || !inquiry.userId) return false;
//   return String(inquiry.userId) === String(userId);
// };

// FILE: server/services/inquiryService.js

import { escapeHtml } from "../utils/escapeHtml.js";
import { isAdminCurrentlyOnline } from "../controllers/authController.js";
import Inquiry, { CONTACT_CHANNELS } from "../models/Inquiry.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { Resend } from "resend";

import { normalizeEmail, normalizePhone } from "../utils/normalize.js";
import { removeStoredInquiryImages } from "../middlewares/inquiryUpload.js";
import { formatPhone } from "../utils/formatPhone.js";
import { validateState } from "../utils/validateState.js";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "hrsanwariyas@gmail.com";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OBJECT_ID_RE = /^[a-f\d]{24}$/i;
const badRequest = (message) => {
  const err = new Error(message);
  err.status = 400;
  return err;
};
const asText = (v) => (typeof v === "string" ? v.trim() : null);

export const validateInquiryInput = (data = {}) => {
  const required = [
    ["name", 120, "Name"],
    ["companyName", 150, "Company name"],
    ["country", 80, "Country"],
    ["message", 3000, "Message"],
  ];
  for (const [key, max, label] of required) {
    const v = asText(data[key]);
    if (!v) throw badRequest(`${label} is required.`);
    if (v.length > max)
      throw badRequest(`${label} must be ${max} characters or fewer.`);
  }
  const email = asText(data.email);
  if (!email || email.length > 150 || !EMAIL_RE.test(email)) {
    throw badRequest("Please enter a valid email address.");
  }
  const digits =
    typeof data.whatsapp === "string" || typeof data.whatsapp === "number"
      ? normalizePhone(data.whatsapp)
      : "";
  if (digits.length < 7 || digits.length > 20) {
    throw badRequest("Please enter a valid WhatsApp number.");
  }
  for (const [key, max] of [
    ["productCategory", 100],
    ["budgetRange", 50],
  ]) {
    const v = data[key];
    if (v !== undefined && v !== null && v !== "") {
      if (typeof v !== "string" || v.trim().length > max)
        throw badRequest(`Invalid ${key}.`);
    }
  }
  if (
    data.quantity !== undefined &&
    data.quantity !== null &&
    data.quantity !== ""
  ) {
    const q = Number(data.quantity);
    if (!Number.isFinite(q) || q < 10 || q > 1e9)
      throw badRequest("Minimum order quantity is 10 pieces.");
  }
  if (
    data.productId &&
    !(typeof data.productId === "string" && OBJECT_ID_RE.test(data.productId))
  ) {
    throw badRequest("Invalid product.");
  }
};

export const STATUS_ALIASES = {
  pending: ["pending", "New"],
  contacted: ["contacted", "In Progress", "Quoted"],
  resolved: ["resolved", "Closed"],
};

const aliasesFor = (status) =>
  typeof status === "string" && Object.hasOwn(STATUS_ALIASES, status)
    ? STATUS_ALIASES[status]
    : null;

const DUPLICATE_WINDOW_MS = 60 * 1000;
const inflightInquiries = new Map();

export const createInquiry = async (data, userId, sampleImages = []) => {
  validateInquiryInput(data);
  const email = data.email ? normalizeEmail(data.email) : "";
  const whatsapp = normalizePhone(data.whatsapp);
  const message = String(data.message).trim();
  const key = [
    userId || "guest",
    email,
    whatsapp,
    message,
    data.productCategory || "",
    data.quantity || "",
  ].join("\u0001");
  const discard = () => removeStoredInquiryImages(sampleImages).catch(() => {});

  if (inflightInquiries.has(key)) {
    const first = await inflightInquiries.get(key);
    await discard();
    return first;
  }
  const work = (async () => {
    const recent = await Inquiry.findOne({
      userId: userId || null,
      email,
      whatsapp,
      message,
      createdAt: { $gte: new Date(Date.now() - DUPLICATE_WINDOW_MS) },
    })
      .sort({ createdAt: -1 })
      .lean();
    if (recent) {
      await discard();
      return recent;
    }
    return createInquiryCore(data, userId, sampleImages);
  })();
  inflightInquiries.set(key, work);
  try {
    return await work;
  } finally {
    inflightInquiries.delete(key);
  }
};

const createInquiryCore = async (data, userId, sampleImages = []) => {
  validateInquiryInput(data);
  const checkedState = validateState(data.state);
  if (checkedState.error) {
    const err = new Error(checkedState.error);
    err.status = 400;
    throw err;
  }
  const inquiry = await Inquiry.create({
    name: data.name,
    companyName: data.companyName,
    email: data.email ? normalizeEmail(data.email) : "",
    whatsapp: normalizePhone(data.whatsapp),
    country: data.country,
    state: checkedState.value,
    productCategory: data.productCategory,
    quantity: data.quantity,
    budgetRange: data.budgetRange,
    message: data.message,
    sampleImages,
    userId: userId || null,
    product: data.productId || null,
    productName: data.productName || "",
    status: "pending",
    isViewedByAdmin: false,
    isViewedByUser: true,
  });

  await Notification.create({
    isGlobalAdmin: true,
    type: "new_inquiry",
    title: "New Wholesale Inquiry",
    message: `New inquiry received from ${data.companyName || data.name}.`,
    relatedInquiryId: inquiry._id,
    link: `/operations-center/inquiries/${inquiry._id}`,
  });

  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from:
          process.env.RESEND_FROM_EMAIL ||
          "Sanwariyas System <onboarding@resend.dev>",
        to: ADMIN_EMAIL,
        subject: `🔥 New Wholesale Inquiry from ${data.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #7A3D2A;">New Wholesale Inquiry Received</h2>
           <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
            <p><strong>WhatsApp:</strong> ${escapeHtml(data.whatsapp ? formatPhone(data.whatsapp) : "Not provided")}</p>
            <p><strong>Company:</strong> ${escapeHtml(data.companyName || "Not provided")}</p>
            <p><strong>State:</strong> ${escapeHtml(checkedState.value)}</p>
            <p><strong>Category:</strong> ${escapeHtml(data.productCategory || "Not provided")}</p>
            <hr style="border: 1px solid #E0BFA2; margin: 20px 0;">
            <h3>Message:</h3>
            <p style="background: #FDF7F2; padding: 15px; border-left: 4px solid #7A3D2A;">
              ${escapeHtml(data.message || "No additional message.")}
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("❌ Failed to send admin email:", emailError.message);
    }
  }

  return inquiry;
};

export const getAllInquiries = async ({ page = 1, limit = 20, status }) => {
  const query = {};
  if (typeof status === "string" && status && status !== "all") {
    query.status = { $in: aliasesFor(status) || [status] };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Inquiry.countDocuments(query);

  const inquiries = await Inquiry.find(query)
    .select("+lastContactedAt +nextFollowUpAt")
    .populate("product", "name slug")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .lean();

  const totalPending = await Inquiry.countDocuments({
    status: { $in: STATUS_ALIASES["pending"] },
  });
  const totalResolved = await Inquiry.countDocuments({
    status: { $in: STATUS_ALIASES["resolved"] },
  });
  const totalContacted = await Inquiry.countDocuments({
    status: { $in: STATUS_ALIASES["contacted"] },
  });
  // Follow-ups whose reminder date has arrived (resolved ones don't count)
  const followUpsDue = await Inquiry.countDocuments({
    nextFollowUpAt: { $ne: null, $lte: new Date() },
    status: { $nin: STATUS_ALIASES["resolved"] },
  });

  const isAdminOnline = await isAdminCurrentlyOnline();

  //  ADDED: Attach Customer Online Status in bulk
  const userIds = inquiries.map((i) => i.userId).filter((id) => id);
  const activeUsers = await User.find({ _id: { $in: userIds } })
    .select("_id lastActiveAt")
    .lean();

  const activeMap = {};
  activeUsers.forEach((u) => {
    if (u.lastActiveAt) {
      const diff = (new Date() - new Date(u.lastActiveAt)) / 1000;
      if (diff < 120) {
        activeMap[u._id.toString()] = true;
      }
    }
  });

  const enrichedInquiries = inquiries.map((inq) => {
    let isCustomerOnline = false;
    if (inq.userId && activeMap[inq.userId.toString()]) isCustomerOnline = true;
    return { ...inq, isAdminOnline, isCustomerOnline };
  });

  return {
    inquiries: enrichedInquiries, //  Replaced 'inquiries' with 'enrichedInquiries'
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit)),
    },
    stats: {
      pending: totalPending,
      contacted: totalContacted,
      resolved: totalResolved,
      followUpsDue,
    },
  };
};

// Ownership is the permanent account id ONLY. Matching email/phone is never
// enough (that let a new registration read someone else's guest inquiries);
// guest inquiries join an account through the verified claim flow
// (inquiryClaimService.js), which sets userId.

export const getUserInquiriesPage = async (userId, { page, limit } = {}) => {
  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
  const [rows, total] = await Promise.all([
    Inquiry.find({ userId })
      .select("-adminNotes -contactLogs -lastContactedAt -nextFollowUpAt")
      .sort({ createdAt: -1 })
      .skip((p - 1) * l)
      .limit(l)
      .lean(),
    Inquiry.countDocuments({ userId }),
  ]);
  const isAdminOnline = await isAdminCurrentlyOnline();
  return {
    inquiries: rows.map((inq) => ({ ...inq, isAdminOnline })),
    pagination: { total, page: p, limit: l, pages: Math.ceil(total / l) },
  };
};

export const getUserInquiries = async (userId) =>
  (await getUserInquiriesPage(userId)).inquiries;

export const getInquiryById = async (id) => {
  const inquiry = await Inquiry.findById(id)
    .select("+adminNotes +contactLogs +lastContactedAt +nextFollowUpAt")
    .populate("product", "name slug")
    .lean();

  if (!inquiry) {
    const error = new Error("Inquiry not found");
    error.statusCode = 404;
    throw error;
  }

  // ✅ Evaluate Customer Online Status
  let isCustomerOnline = false;
  let userObj = null;
  if (inquiry.userId) {
    userObj = await User.findById(inquiry.userId).select("lastActiveAt").lean();
  }

  if (userObj && userObj.lastActiveAt) {
    const diffSeconds = (new Date() - new Date(userObj.lastActiveAt)) / 1000;
    if (diffSeconds < 120) isCustomerOnline = true;
  }
  inquiry.isCustomerOnline = isCustomerOnline;

  // Evaluate Admin Online Status
  inquiry.isAdminOnline = await isAdminCurrentlyOnline();

  return inquiry;
};

export const updateInquiryStatus = async (id, { status, adminNotes }) => {
  if (status && !aliasesFor(status)) {
    const err = new Error("Invalid inquiry status");
    err.statusCode = 400;
    throw err;
  }
  const update = {};
  if (status) update.status = status;
  if (adminNotes !== undefined) update.adminNotes = adminNotes;

  const inquiry = await Inquiry.findByIdAndUpdate(id, update, {
    new: true,
  }).lean();

  if (!inquiry) {
    const error = new Error("Inquiry not found");
    error.statusCode = 404;
    throw error;
  }

  return inquiry;
};

export const addReplyToInquiry = async (id, senderId, role, message) => {
  const inquiry = await Inquiry.findById(id);

  if (!inquiry) {
    const error = new Error("Inquiry not found");
    error.statusCode = 404;
    throw error;
  }

  inquiry.replies.push({
    senderId,
    role,
    message,
    isReadByAdmin: role === "customer" ? false : true,
  });

  if (role === "admin" || role === "staff") {
    inquiry.isViewedByUser = false;
    if (inquiry.status === "pending") inquiry.status = "contacted";

    if (inquiry.userId) {
      await Notification.create({
        recipientId: inquiry.userId,
        type: "inquiry_reply",
        title: "New Reply on Your Inquiry",
        message: `Sanwariyas has replied to your inquiry regarding ${inquiry.productCategory}.`,
        relatedInquiryId: inquiry._id,
        link: `/my-inquiries/${inquiry._id}`,
      });
    }

    if (process.env.RESEND_API_KEY && inquiry.email) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from:
            process.env.RESEND_FROM_EMAIL ||
            "Sanwariyas Updates <onboarding@resend.dev>",
          to: inquiry.email,
          subject: `Update on your Sanwariyas Inquiry`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
              <p>Hello ${escapeHtml(inquiry.name)},</p>
              <p>We have replied to your inquiry regarding <strong>${escapeHtml(inquiry.productCategory)}</strong>.</p>
              <p style="background: #FDF7F2; padding: 15px; border-left: 4px solid #7A3D2A;">
                <strong>Admin Reply:</strong><br/><br/>
                ${escapeHtml(message)}
              </p>
              <p>Please log in to your dashboard to continue the conversation.</p>
            </div>
           `,
        });
      } catch (e) {
        console.error("❌ Customer reply email failed:", e.message);
      }
    }
  } else {
    inquiry.isViewedByAdmin = false;
    await Notification.create({
      isGlobalAdmin: true,
      type: "inquiry_reply",
      title: "Customer Replied",
      message: `${inquiry.companyName || inquiry.name} replied to their inquiry.`,
      relatedInquiryId: inquiry._id,
      link: `/operations-center/inquiries/${inquiry._id}`,
    });
  }

  await inquiry.save();
  return inquiry;
};

export const markInquiryAsViewed = async (id, role) => {
  if (role === "customer") {
    const inquiry = await Inquiry.findByIdAndUpdate(
      id,
      { isViewedByUser: true },
      { new: true },
    );

    if (inquiry && inquiry.userId) {
      // customer can  see the  inquiry reply
      // delete  this inquiry  related notification
      // NOTE: scoped strictly to this customer's own notifications
      // (isGlobalAdmin: false) so a guest/null userId can never collide
      // with the admin's isGlobalAdmin notifications, which also default
      // to recipientId: null.

      await Notification.deleteMany({
        recipientId: inquiry.userId,
        relatedInquiryId: inquiry._id,
        isGlobalAdmin: false,
      });
    }

    return inquiry;
  } else {
    const inquiry = await Inquiry.findById(id);

    if (!inquiry) {
      const error = new Error("Inquiry not found");
      error.statusCode = 404;
      throw error;
    }

    // Mark all customer replies as read
    inquiry.replies = inquiry.replies.map((reply) => {
      if (reply.role === "customer") {
        reply.isReadByAdmin = true;
      }
      return reply;
    });

    inquiry.isViewedByAdmin = true;

    await inquiry.save();

    // Admin/Staff  can  see  the  inquiry
    // delete  this  inquiry  related notification
    // NOTE: scoped strictly to isGlobalAdmin: true so this never touches
    // the customer's own recipientId-based notification for the same
    // inquiry (e.g. the "New Reply" notification just created above).

    await Notification.deleteMany({
      isGlobalAdmin: true,
      relatedInquiryId: inquiry._id,
    });

    return inquiry;
  }
};

export const deleteInquiryById = async (id) => {
  const inquiry = await Inquiry.findByIdAndDelete(id);

  if (!inquiry) {
    const error = new Error("Inquiry not found");
    error.statusCode = 404;
    throw error;
  }

  await Notification.deleteMany({ relatedInquiryId: id });

  // DB record gone — also remove its uploaded images from disk.
  await removeStoredInquiryImages(inquiry.sampleImages);

  return inquiry;
};

export const isInquiryOwnedByUser = async (id, userId) => {
  if (!userId) return false;
  const inquiry = await Inquiry.findById(id).select("userId").lean();
  if (!inquiry || !inquiry.userId) return false;
  return String(inquiry.userId) === String(userId);
};

// ─────────────────────────────────────────────────────────────────────────
// PRIVATE CONTACT LOG (admin only)
// What the admin discussed with the customer on call / WhatsApp / email.
// Stored on the inquiry, never exposed to customers (see select:false in the
// model + the customer routes, which never request these fields).
// ─────────────────────────────────────────────────────────────────────────
const LOG_FIELDS = "+contactLogs +lastContactedAt +nextFollowUpAt";
const MAX_LOG_NOTE = 3000;
const MAX_LOGS_PER_INQUIRY = 500;

const notFound = () => {
  const err = new Error("Inquiry not found");
  err.statusCode = 404;
  return err;
};
const badLog = (message) => {
  const err = new Error(message);
  err.statusCode = 400;
  return err;
};

// Same shape the admin detail page needs after any log change.
const logView = (doc) => {
  const o = typeof doc.toObject === "function" ? doc.toObject() : doc;
  return {
    _id: o._id,
    status: o.status,
    contactLogs: o.contactLogs || [],
    lastContactedAt: o.lastContactedAt || null,
    nextFollowUpAt: o.nextFollowUpAt || null,
  };
};

const syncLogSummary = (inquiry) => {
  const logs = [...inquiry.contactLogs].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
  inquiry.lastContactedAt = logs[0]?.createdAt || null;
  // The newest log decides the reminder (blank follow-up => reminder cleared).
  inquiry.nextFollowUpAt = logs[0]?.followUpAt || null;
};

export const addContactLog = async (
  id,
  { note, channel, followUpAt, markContacted = true },
  createdBy = "admin",
) => {
  const text = typeof note === "string" ? note.trim() : "";
  if (!text) throw badLog("Please write what you discussed with the customer.");
  if (text.length > MAX_LOG_NOTE)
    throw badLog(`Note must be ${MAX_LOG_NOTE} characters or fewer.`);

  const ch = channel === undefined || channel === "" ? "whatsapp" : channel;
  if (!CONTACT_CHANNELS.includes(ch)) throw badLog("Invalid contact channel.");

  let follow = null;
  if (followUpAt !== undefined && followUpAt !== null && followUpAt !== "") {
    follow = new Date(followUpAt);
    if (Number.isNaN(follow.getTime())) throw badLog("Invalid follow-up date.");
  }

  const inquiry = await Inquiry.findById(id).select(LOG_FIELDS);
  if (!inquiry) throw notFound();
  if (inquiry.contactLogs.length >= MAX_LOGS_PER_INQUIRY)
    throw badLog("Contact log limit reached for this inquiry.");

  inquiry.contactLogs.push({
    note: text,
    channel: ch,
    followUpAt: follow,
    createdBy: String(createdBy || "admin").slice(0, 150),
  });
  // The new entry has no createdAt until saved, so set the summary directly.
  inquiry.lastContactedAt = new Date();
  inquiry.nextFollowUpAt = follow; // blank follow-up clears the old reminder

  // First real contact moves a NEW inquiry to "contacted" automatically.
  if (markContacted && STATUS_ALIASES.pending.includes(inquiry.status)) {
    inquiry.status = "contacted";
  }

  await inquiry.save();
  return logView(inquiry);
};

export const deleteContactLog = async (id, logId) => {
  const inquiry = await Inquiry.findById(id).select(LOG_FIELDS);
  if (!inquiry) throw notFound();

  const log = inquiry.contactLogs.id(logId);
  if (!log) {
    const err = new Error("Contact log entry not found");
    err.statusCode = 404;
    throw err;
  }
  inquiry.contactLogs.pull(logId);
  syncLogSummary(inquiry);
  await inquiry.save();
  return logView(inquiry);
};
