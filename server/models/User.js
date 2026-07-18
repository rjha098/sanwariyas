// // FILE: server/models/User.js
// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';

// const userSchema = new mongoose.Schema(
//   {
//     name: { 
//       type: String, 
//       required: [true, 'Name is required'], 
//       trim: true,
//       minlength: [3, 'Name must be at least 3 characters long']
//     },
//     email: { 
//       type: String, 
//       required: [true, 'Email is required'], 
//       unique: true, 
//       lowercase: true, 
//       trim: true,
//       match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
//     },
//     phone: { 
//       type: String, 
//       required: [true, 'Phone number is required'], 
//       trim: true,
//       match: [/^\+?[0-9]{10,15}$/, 'Please enter a valid 10-15 digit phone number']
//     },
//     company: { type: String, default: '', trim: true },
//     country: { type: String, default: '', trim: true },
//     password: { 
//       type: String, 
//       required: [true, 'Password is required'],
//       minlength: [8, 'Password must be at least 8 characters long']
//     },
//     role: { 
//       type: String, 
//       enum: ['admin', 'staff', 'customer'], 
//       default: 'customer' 
//     },
//     isActive: { type: Boolean, default: true },

//     // Single Device Session Tracking
//     currentSessionId: { type: String, default: null },

//     // Email verification / login OTP (for customers)
//     isVerified:   { type: Boolean, default: false },
//     verifyToken:  { type: String,  default: null },
//     verifyExpiry: { type: Date,    default: null },
//     loginOtpHash: { type: String,  default: null },
//     loginOtpExpiry: { type: Date,  default: null },
//   },
//   { timestamps: true }
// );

// // Hash password before save
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 12);
//   next();
// });

// export default mongoose.model('User', userSchema);



import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Name is required'], 
      trim: true,
      minlength: [3, 'Name must be at least 3 characters long']
    },
    email: { 
      type: String, 
      required: [true, 'Email is required'], 
      unique: true, 
      lowercase: true, 
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
    },
    phone: { 
      type: String, 
      required: [true, 'Phone number is required'], 
      trim: true,
      match: [/^\+?[0-9]{10,15}$/, 'Please enter a valid 10-15 digit phone number']
    },
    company: { type: String, default: '', trim: true },
    country: { type: String, default: '', trim: true },
    password: { 
      type: String, 
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long']
    },
    role: { 
      type: String, 
      enum: ['admin', 'staff', 'customer'], 
      default: 'customer' 
    },
    isActive: { type: Boolean, default: true },

    // Single Device Session Tracking
    currentSessionId: { type: String, default: null },

    // ✅ FIX: Added to track when the user was last active
    lastActiveAt: { type: Date, default: Date.now },

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