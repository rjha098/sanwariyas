// FILE: server/services/inquiryService.js
import { isAdminCurrentlyOnline } from "../controllers/authController.js";
import Inquiry from "../models/Inquiry.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js"; 
import { Resend } from "resend";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "hrsanwariyas@gmail.com";

const STATUS_ALIASES = {
  pending: ["pending", "New"],
  contacted: ["contacted", "In Progress", "Quoted"],
  resolved: ["resolved", "Closed"],
};

export const createInquiry = async (data, userId) => {

  const inquiry = await Inquiry.create({
    name: data.name,
    companyName: data.companyName,
    email: data.email ? data.email.toLowerCase().trim() : "",
    whatsapp: data.whatsapp,
    country: data.country,
    productCategory: data.productCategory,
    quantity: data.quantity,
    budgetRange: data.budgetRange,
    message: data.message,
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
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>WhatsApp:</strong> ${data.whatsapp || "Not provided"}</p>
            <p><strong>Company:</strong> ${data.companyName || "Not provided"}</p>
            <p><strong>Category:</strong> ${data.productCategory || "Not provided"}</p>
            <hr style="border: 1px solid #E0BFA2; margin: 20px 0;">
            <h3>Message:</h3>
            <p style="background: #FDF7F2; padding: 15px; border-left: 4px solid #7A3D2A;">
              ${data.message || "No additional message."}
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
  if (status && status !== "all") {
    query.status = { $in: STATUS_ALIASES[status] || [status] };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Inquiry.countDocuments(query);

  const inquiries = await Inquiry.find(query)
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

  const isAdminOnline = await isAdminCurrentlyOnline();

  // ✅ ADDED: Attach Customer Online Status in bulk
  const userIds = inquiries.map((i) => i.userId).filter((id) => id);
  const emails = inquiries.map((i) => i.email).filter((e) => e);
  const activeUsers = await User.find({
    $or: [{ _id: { $in: userIds } }, { email: { $in: emails } }],
  })
    .select("_id email lastActiveAt")
    .lean();

  const activeMap = {};
  activeUsers.forEach((u) => {
    if (u.lastActiveAt) {
      const diff = (new Date() - new Date(u.lastActiveAt)) / 1000;
      if (diff < 120) {
        activeMap[u._id.toString()] = true;
        if (u.email) activeMap[u.email.toLowerCase()] = true;
      }
    }
  });

  const enrichedInquiries = inquiries.map((inq) => {
    let isCustomerOnline = false;
    if (inq.userId && activeMap[inq.userId.toString()]) isCustomerOnline = true;
    else if (inq.email && activeMap[inq.email.toLowerCase()])
      isCustomerOnline = true;
    return { ...inq, isAdminOnline, isCustomerOnline };
  });

  return {
    inquiries: enrichedInquiries, // ✅ Replaced 'inquiries' with 'enrichedInquiries'
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit)),
    },
    stats: { pending: totalPending, resolved: totalResolved },
  };
};

export const getUserInquiries = async (userId, email) => {
  const inquiries = await Inquiry.find({
    $or: [{ userId }, { email: email?.toLowerCase().trim() }],
  })
    .sort({ createdAt: -1 })
    .lean();

  const isAdminOnline = await isAdminCurrentlyOnline();

  return inquiries.map((inq) => ({ ...inq, isAdminOnline }));
};

export const getInquiryById = async (id) => {
  const inquiry = await Inquiry.findById(id)
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
  } else if (inquiry.email) {
    userObj = await User.findOne({ email: inquiry.email })
      .select("lastActiveAt")
      .lean();
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
  if (status && !STATUS_ALIASES[status]) {
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
              <p>Hello ${inquiry.name},</p>
              <p>We have replied to your inquiry regarding <strong>${inquiry.productCategory}</strong>.</p>
              <p style="background: #FDF7F2; padding: 15px; border-left: 4px solid #7A3D2A;">
                <strong>Admin Reply:</strong><br/><br/>
                ${message}
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
    return await Inquiry.findByIdAndUpdate(
      id,
      { isViewedByUser: true },
      { new: true },
    );
  } else {
    const inquiry = await Inquiry.findById(id);

    if (!inquiry) {
      const error = new Error("Inquiry not found");
      error.statusCode = 404;
      throw error;
    }

    // Mark all customer replies as read directly
    inquiry.replies = inquiry.replies.map((reply) => {
      if (reply.role === "customer") {
        reply.isReadByAdmin = true;
      }
      return reply;
    });
    inquiry.isViewedByAdmin = true;

    return await inquiry.save();
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
  return inquiry;
};

// server/services/inquiryService.js — add this helper, use it in markInquiryAsViewed too
export const isInquiryOwnedByUser = async (id, userId, email) => {
  const inquiry = await Inquiry.findById(id).select("userId email").lean();
  if (!inquiry) return false;
  if (userId && inquiry.userId && String(inquiry.userId) === String(userId))
    return true;
  if (
    email &&
    inquiry.email &&
    inquiry.email.toLowerCase() === email.toLowerCase()
  )
    return true;
  return false;
};
