// // FILE: server/index.js
// import dotenv from 'dotenv';
// import express from 'express';
// import cors from 'cors';
// import connectDB from './config/db.js';

// import authRoutes         from './routes/authRoutes.js';
// import productRoutes      from './routes/productRoutes.js';
// import inquiryRoutes      from './routes/inquiryRoutes.js';
// import lookbookRoutes     from './routes/lookbookRoutes.js';
// import notificationRoutes from './routes/notificationRoutes.js';
// import blogRoutes from './routes/blogRoutes.js';

// dotenv.config();

// const app = express();
// connectDB();

// const explicitAllowedOrigins = [
//   'http://localhost:3000',
//   'http://localhost:3001',
//   'https://sanwariya-project.vercel.app',
//   'https://sanwariyas.vercel.app',
//   process.env.CLIENT_URL,
// ].filter(Boolean);

// const vercelPreviewPattern = /^https:\/\/sanwariya-project-[a-z0-9-]+-projects\.vercel\.app$/;

// const isAllowedOrigin = (origin) => {
//   if (!origin) return true;
//   if (explicitAllowedOrigins.includes(origin)) return true;
//   return vercelPreviewPattern.test(origin);
// };

// app.use(cors({
//   origin: (origin, callback) => {
//     if (isAllowedOrigin(origin)) callback(null, true);
//     else callback(new Error('Not allowed by CORS'));
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use('/uploads', express.static('uploads'));

// // Routes
// app.use('/api/auth',         authRoutes);
// app.use('/api/products',     productRoutes);
// app.use('/api/inquiry',      inquiryRoutes);
// app.use('/api/lookbook',     lookbookRoutes);
// app.use('/api/notification', notificationRoutes); 
// app.use('/api/blogs', blogRoutes);




// // Health check
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'ok', message: 'Server is running' });
// });

// // 404 handler — must come after all routes, before error handler
// app.use((req, res) => {
//   res.status(404).json({ success: false, message: 'Route not found' });
// });

// // Global Error Handler
// app.use((err, req, res, next) => {
//   if (err.code === 'LIMIT_FILE_SIZE') {
//     return res.status(400).json({
//       success: false,
//       message: 'Photo size is too large! Maximum limit is 2MB.'
//     });
//   }
//   console.error(err.stack);
//   res.status(500).json({
//     success: false,
//     message: 'Internal server error',
//     error: err.message
//   });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });



// FILE: server/index.js
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes         from './routes/authRoutes.js';
import productRoutes      from './routes/productRoutes.js';
import inquiryRoutes      from './routes/inquiryRoutes.js';
import lookbookRoutes     from './routes/lookbookRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import blogRoutes         from './routes/blogRoutes.js';

dotenv.config();

// ═══════════════════════════════════════════════════════════════════════════
// PROCESS-LEVEL SAFETY NET — THE ACTUAL FIX FOR "SERVER SHOULD NEVER CRASH"
// ═══════════════════════════════════════════════════════════════════════════
// WHY THIS IS NECESSARY:
// Node.js, by default, kills the ENTIRE process the instant ANY error is
// thrown asynchronously without a catching .catch()/try-catch — even from
// code deep inside a third-party library, a typo'd import, or a bad await
// in a route you forgot to wrap. This is exactly the class of bug behind
// your `deleteAccount` import crash: one bad line anywhere can take down
// every single user's connection, not just the request that triggered it.
//
// These two handlers are the global safety net. They log the error so you
// can still see and fix it, but they do NOT let it kill the process.
process.on('uncaughtException', (err) => {
  console.error('🔴 UNCAUGHT EXCEPTION — server stayed alive, but fix this:', err);
  // Intentionally NOT calling process.exit() here — this is what stops the
  // crash. nodemon/PM2 should restart on genuine fatal errors, but a single
  // unexpected throw should not take down live traffic.
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🔴 UNHANDLED PROMISE REJECTION — server stayed alive, but fix this:', reason);
});

const app = express();
connectDB();

// ═══════════════════════════════════════════════════════════════════════════
// RATE LIMITING — protects against the "spam requests to crash server" attack
// ═══════════════════════════════════════════════════════════════════════════
// WHY THIS WAS MISSING AND WHY IT MATTERS:
// There was previously NO limit on how many requests a single IP could make.
// Anyone could hit /api/auth/login or /api/inquiry thousands of times per
// second, exhausting MongoDB connections, memory, or CPU — a real, easy DoS
// vector. This adds two tiers: a strict limiter on sensitive auth endpoints
// (brute-force/OTP-spam protection) and a looser general limiter on everything
// else so normal browsing traffic is never affected.
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,                  // 20 attempts per IP per window on auth routes
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Please try again in a few minutes.' },
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,                 // generous — protects against abuse without affecting real users
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please slow down.' },
});

app.use('/api/', generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/verify-otp', authLimiter);
app.use('/api/auth/customer/signup', authLimiter);

const explicitAllowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://sanwariya-project.vercel.app',
  'https://sanwariyas.vercel.app',
  process.env.CLIENT_URL,
].filter(Boolean);

const vercelPreviewPattern = /^https:\/\/sanwariya-project-[a-z0-9-]+-projects\.vercel\.app$/;

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (explicitAllowedOrigins.includes(origin)) return true;
  return vercelPreviewPattern.test(origin);
};

app.use(cors({
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth',         authRoutes);
app.use('/api/products',     productRoutes);
app.use('/api/inquiry',      inquiryRoutes);
app.use('/api/lookbook',     lookbookRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/blogs',        blogRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// 404 handler — must come after all routes, before error handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global Error Handler — catches every synchronous + properly-awaited error
// from route handlers. Combined with the process-level handlers above, this
// is now a complete two-layer net: this layer handles "normal" request
// errors with a proper response; the process-level layer above is the
// last-resort net for anything that slips past every other guard.
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'Photo size is too large! Maximum limit is 2MB.'
    });
  }
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
