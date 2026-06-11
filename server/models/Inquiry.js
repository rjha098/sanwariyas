// FILE: server/models/Inquiry.js
import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['admin', 'staff', 'customer'], required: true },
  message: { type: String, required: true }
}, { timestamps: true });

const inquirySchema = new mongoose.Schema(
  {
   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    name: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    whatsapp: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    productCategory: { 
      type: String, 
      required: true, 
      // enum: ['Cotton', 'Georgette', 'Silk', 'Rayon', 'Mixed', 'Other'] 
    },
    quantity: { type: Number, required: true, min: 50 },
    budgetRange: { type: String, default: 'Not specified' },
    message: { type: String, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
    productName: { type: String, default: '' },
    status: { 
      type: String, 
      enum: ['pending', 'contacted', 'resolved'], 
      default: 'pending' 
    },
    replies: [replySchema],
    isViewedByAdmin: { type: Boolean, default: false },
    isViewedByUser: { type: Boolean, default: true },
    adminNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

inquirySchema.index({ status: 1 });
inquirySchema.index({ userId: 1 });
inquirySchema.index({ createdAt: -1 });

export default mongoose.model('Inquiry', inquirySchema);