// FILE: server/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true, trim: true },
    email:   { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone:   { type: String, default: '', trim: true },
    company: { type: String, default: '', trim: true },
    country: { type: String, default: '', trim: true },
    password:{ type: String, required: true },
    role:    { type: String, enum: ['admin', 'staff', 'customer'], default: 'customer' },
    isActive:{ type: Boolean, default: true },

    // Email verification / login OTP (for customers)
    isVerified:   { type: Boolean, default: false },
    verifyToken:  { type: String,  default: null },
    verifyExpiry: { type: Date,    default: null },
    loginOtpHash: { type: String,  default: null },
    loginOtpExpiry: { type: Date,  default: null },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

export default mongoose.model('User', userSchema);
