// PURPOSE: Save inquiry to DB and optionally send email
import Inquiry from '../models/Inquiry.js';
import nodemailer from 'nodemailer';

const STATUS_ALIASES = {
  pending: ['pending', 'New'],
  contacted: ['contacted', 'In Progress', 'Quoted'],
  resolved: ['resolved', 'Closed'],
};

const LEGACY_STATUS_MAP = {
  New: 'pending',
  'In Progress': 'contacted',
  Quoted: 'contacted',
  Closed: 'resolved',
};

const normalizeInquiryStatus = (inquiry) => ({
  ...inquiry,
  status: LEGACY_STATUS_MAP[inquiry.status] || inquiry.status,
});

const createInquiry = async (data) => {
  const inquiry = await Inquiry.create({
    ...data,
    product: data.productId || null,
    productName: data.productName || '',
    status: 'pending',
  });

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    await sendEmailNotification(inquiry);
  }
  return inquiry;
};

const sendEmailNotification = async (inquiry) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `[NEW B2B LEAD] ${inquiry.companyName}`,
      html: `<h2>New Inquiry from ${inquiry.name}</h2>` // Add full HTML here
    });
  } catch (error) {
    console.error('Email failed:', error.message);
  }
};

const getAllInquiries = async ({ page = 1, limit = 20, status, country }) => {
  const query = {};
  if (status) query.status = { $in: STATUS_ALIASES[status] || [status] };
  if (country) query.country = country;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Inquiry.countDocuments(query);
  const inquiries = await Inquiry.find(query)
    .populate('product', 'name slug')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .lean();

  return {
    inquiries: inquiries.map(normalizeInquiryStatus),
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit)),
    },
  };
};

const updateInquiryStatus = async (id, { status, adminNotes }) => {
  if (!STATUS_ALIASES[status]) {
    const error = new Error('Invalid inquiry status');
    error.statusCode = 400;
    throw error;
  }

  const update = { status };
  if (adminNotes !== undefined) update.adminNotes = adminNotes;

  const inquiry = await Inquiry.findByIdAndUpdate(id, update, { new: true, runValidators: true }).lean();
  if (!inquiry) throw new Error('Inquiry not found');
  return normalizeInquiryStatus(inquiry);
};

export {
  createInquiry,
  getAllInquiries,
  updateInquiryStatus,
};
