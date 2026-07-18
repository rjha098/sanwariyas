import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipientId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  isGlobalAdmin:    { type: Boolean, default: false },
  type:             { type: String, enum: ['new_inquiry', 'inquiry_reply', 'system'], required: true },
  title:            { type: String, required: true },
  message:          { type: String, required: true },
  isRead:           { type: Boolean, default: false },
  relatedInquiryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inquiry', default: null },
  link:             { type: String, default: null }, 
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);