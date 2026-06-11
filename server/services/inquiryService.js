// // FILE: server/services/inquiryService.js
// import Inquiry from '../models/Inquiry.js';
// import Notification from '../models/Notification.js';

// const STATUS_ALIASES = {
//   pending: ['pending', 'New'],
//   contacted: ['contacted', 'In Progress', 'Quoted'],
//   resolved: ['resolved', 'Closed'],
// };

// export const createInquiry = async (data, userId) => {
//   const inquiry = await Inquiry.create({
//     ...data,
//     // ✅ CRITICAL FIX: Email ko properly format karke save karo taaki authService mein mapping fail na ho
//     email: data.email ? data.email.toLowerCase().trim() : '', 
//     userId,
//     product: data.productId || null,
//     productName: data.productName || '',
//     status: 'pending',
//     isViewedByAdmin: false,
//     isViewedByUser: true
//   });

//   // Create Notification for Admin
//   await Notification.create({
//     isGlobalAdmin: true,
//     type: 'new_inquiry',
//     title: 'New Wholesale Inquiry',
//     message: `You have received a new inquiry from ${data.companyName}.`,
//     relatedInquiryId: inquiry._id
//   });

//   return inquiry;
// };

// export const getAllInquiries = async ({ page = 1, limit = 20, status }) => {
//   const query = {};
//   if (status) query.status = { $in: STATUS_ALIASES[status] || [status] };

//   const skip = (parseInt(page) - 1) * parseInt(limit);
//   const total = await Inquiry.countDocuments(query);
//   const inquiries = await Inquiry.find(query)
//     .populate('product', 'name slug')
//     .sort({ createdAt: -1 })
//     .skip(skip)
//     .limit(parseInt(limit))
//     .lean();
// replyToInquiry

//     const totalPending = await Inquiry.countDocuments({ status: { $in: STATUS_ALIASES['pending'] || ['pending', 'New'] } });
//   const totalResolved = await Inquiry.countDocuments({ status: { $in: STATUS_ALIASES['resolved'] || ['resolved', 'Closed'] } });


//   return {
//     inquiries,
//     pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) },
//     stats: { pending: totalPending, resolved: totalResolved }
//   };
// };

// export const getUserInquiries = async (userId) => {
//   return await Inquiry.find({ userId }).sort({ createdAt: -1 }).lean();
// };

// export const updateInquiryStatus = async (id, { status, adminNotes }) => {
//   const update = { status };
//   if (adminNotes !== undefined) update.adminNotes = adminNotes;

//   const inquiry = await Inquiry.findByIdAndUpdate(id, update, { new: true }).lean();
//   if (!inquiry) throw new Error('Inquiry not found');
//   return inquiry;
// };

// export const addReplyToInquiry = async (id, senderId, role, message) => {
//   const inquiry = await Inquiry.findById(id);
//   if (!inquiry) throw new Error('Inquiry not found');

//   inquiry.replies.push({ senderId, role, message });

//   if (role === 'admin' || role === 'staff') {
//     inquiry.isViewedByUser = false;
//     inquiry.status = 'contacted';
//     await Notification.create({
//       recipientId: inquiry.userId,
//       type: 'inquiry_reply',
//       title: 'New Reply Received',
//       message: `Admin has replied to your inquiry regarding ${inquiry.productCategory}.`,
//       relatedInquiryId: inquiry._id
//     });
//   } else {
//     inquiry.isViewedByAdmin = false;
//     await Notification.create({
//       isGlobalAdmin: true,
//       type: 'inquiry_reply',
//       title: 'New Customer Message',
//       message: `${inquiry.companyName} replied to their inquiry.`,
//       relatedInquiryId: inquiry._id
//     });
//   }

//   await inquiry.save();
//   return inquiry;
// };

// export const markInquiryAsViewed = async (id, role) => {
//   const update = role === 'customer' ? { isViewedByUser: true } : { isViewedByAdmin: true };
//   return await Inquiry.findByIdAndUpdate(id, update, { new: true });
// };

// export const getInquiryById = async (id) => {
//   const inquiry = await Inquiry.findById(id).populate('product', 'name slug').lean();
//   if (!inquiry) throw new Error('Inquiry not found');
//   return inquiry;
// };

// export const deleteInquiryById = async (id) => {
//   const inquiry = await Inquiry.findByIdAndDelete(id);
//   if (!inquiry) throw new Error('Inquiry not found');
//   return inquiry;
// };




// FILE: server/services/inquiryService.js
import Inquiry from '../models/Inquiry.js';
import Notification from '../models/Notification.js';

const STATUS_ALIASES = {
  pending:   ['pending', 'New'],
  contacted: ['contacted', 'In Progress', 'Quoted'],
  resolved:  ['resolved', 'Closed'],
};

export const createInquiry = async (data, userId) => {
  const inquiry = await Inquiry.create({
    ...data,
    email:          data.email ? data.email.toLowerCase().trim() : '',
    userId:         userId || null,
    product:        data.productId || null,
    productName:    data.productName || '',
    status:         'pending',
    isViewedByAdmin: false,
    isViewedByUser:  true,
  });

  await Notification.create({
    isGlobalAdmin:    true,
    type:             'new_inquiry',
    title:            'New Wholesale Inquiry',
    message:          `New inquiry received from ${data.companyName || data.name}.`,
    relatedInquiryId: inquiry._id,
  });

  return inquiry;
};

export const getAllInquiries = async ({ page = 1, limit = 20, status }) => {
  const query = {};
  if (status && status !== 'all') {
    query.status = { $in: STATUS_ALIASES[status] || [status] };
  }

  const skip  = (parseInt(page) - 1) * parseInt(limit);
  const total = await Inquiry.countDocuments(query);

  const inquiries = await Inquiry.find(query)
    .populate('product', 'name slug')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .lean();

  const totalPending  = await Inquiry.countDocuments({ status: { $in: STATUS_ALIASES['pending'] } });
  const totalResolved = await Inquiry.countDocuments({ status: { $in: STATUS_ALIASES['resolved'] } });

  return {
    inquiries,
    pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) },
    stats: { pending: totalPending, resolved: totalResolved },
  };
};

// export const getUserInquiries = async (userId) => {
//   return await Inquiry.find({ userId }).sort({ createdAt: -1 }).lean();
// };

export const getUserInquiries = async (
  userId,
  email
) => {
  return await Inquiry.find({
    $or: [
      { userId },
      {
        email: email?.toLowerCase().trim()
      }
    ]
  })
    .sort({ createdAt: -1 })
    .lean();
};



export const getInquiryById = async (id) => {
  const inquiry = await Inquiry.findById(id).populate('product', 'name slug').lean();
  if (!inquiry) throw new Error('Inquiry not found');
  return inquiry;
};

export const updateInquiryStatus = async (id, { status, adminNotes }) => {
  if (status && !STATUS_ALIASES[status]) {
    const err = new Error('Invalid inquiry status');
    err.statusCode = 400;
    throw err;
  }
  const update = {};
  if (status)                       update.status     = status;
  if (adminNotes !== undefined)     update.adminNotes = adminNotes;

  const inquiry = await Inquiry.findByIdAndUpdate(id, update, { new: true }).lean();
  if (!inquiry) throw new Error('Inquiry not found');
  return inquiry;
};

export const addReplyToInquiry = async (id, senderId, role, message) => {
  const inquiry = await Inquiry.findById(id);
  if (!inquiry) throw new Error('Inquiry not found');

  inquiry.replies.push({ senderId, role, message });

  if (role === 'admin' || role === 'staff') {
    inquiry.isViewedByUser = false;
    if (inquiry.status === 'pending') inquiry.status = 'contacted';

    if (inquiry.userId) {
      await Notification.create({
        recipientId:      inquiry.userId,
        type:             'inquiry_reply',
        title:            'New Reply on Your Inquiry',
        message:          `Sanwariyas has replied to your inquiry regarding ${inquiry.productCategory}.`,
        relatedInquiryId: inquiry._id,
      });
    }
  } else {
    inquiry.isViewedByAdmin = false;
    await Notification.create({
      isGlobalAdmin:    true,
      type:             'inquiry_reply',
      title:            'Customer Replied',
      message:          `${inquiry.companyName || inquiry.name} replied to their inquiry.`,
      relatedInquiryId: inquiry._id,
    });
  }

  await inquiry.save();
  return inquiry;
};

export const markInquiryAsViewed = async (id, role) => {
  const update = role === 'customer'
    ? { isViewedByUser: true }
    : { isViewedByAdmin: true };
  return await Inquiry.findByIdAndUpdate(id, update, { new: true });
};

export const deleteInquiryById = async (id) => {
  const inquiry = await Inquiry.findByIdAndDelete(id);
  if (!inquiry) throw new Error('Inquiry not found');
  await Notification.deleteMany({ relatedInquiryId: id });
  return inquiry;
};