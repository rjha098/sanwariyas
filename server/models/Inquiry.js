// PURPOSE: Define the SHAPE of an Inquiry in MongoDB

import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    whatsapp: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    productCategory: { 
      type: String, 
      required: true, 
      enum: ['Cotton', 'Georgette', 'Silk', 'Rayon', 'Mixed', 'Other'] 
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
    adminNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

inquirySchema.index({ status: 1 });
inquirySchema.index({ createdAt: -1 });

export default mongoose.model('Inquiry', inquirySchema);
