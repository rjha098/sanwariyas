// FILE: server/index.js
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";
import lookbookRoutes from "./routes/lookbookRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";

dotenv.config();

// ═══════════════════════════════════════════════════════════════════════════
// PROCESS-LEVEL SAFETY NET
// ═══════════════════════════════════════════════════════════════════════════
process.on("uncaughtException", (err) => {
  console.error(
    "🔴 UNCAUGHT EXCEPTION — server stayed alive, but fix this:",
    err,
  );
});

process.on("unhandledRejection", (reason, promise) => {
  console.error(
    "🔴 UNHANDLED PROMISE REJECTION — server stayed alive, but fix this:",
    reason,
  );
});

const app = express();
connectDB();

// ═══════════════════════════════════════════════════════════════════════════
// 1. CORS MIDDLEWARE (MUST BE FIRST)
// ═══════════════════════════════════════════════════════════════════════════
const explicitAllowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://sanwariya-project.vercel.app",
  "https://sanwariyas.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean);

const vercelPreviewPattern =
  /^https:\/\/sanwariya-project-[a-z0-9-]+-projects\.vercel\.app$/;

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (explicitAllowedOrigins.includes(origin)) return true;
  return vercelPreviewPattern.test(origin);
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) callback(null, true);
      else callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ═══════════════════════════════════════════════════════════════════════════
// 2. BODY PARSERS
// ═══════════════════════════════════════════════════════════════════════════
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// ═══════════════════════════════════════════════════════════════════════════
// 3. RATE LIMITING
// ═══════════════════════════════════════════════════════════════════════════
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts per IP per window on auth routes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts. Please try again in a few minutes.",
  },
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300, // generous — protects against abuse without affecting real users
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please slow down." },
});

const notificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please slow down." },
});

app.use("/api/", generalLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/verify-otp", authLimiter);
app.use("/api/auth/customer/signup", authLimiter);

// ═══════════════════════════════════════════════════════════════════════════
// 4. ROUTES
// ═══════════════════════════════════════════════════════════════════════════
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/inquiry", inquiryRoutes);
app.use("/api/lookbook", lookbookRoutes);

app.use("/api/notification", notificationLimiter, notificationRoutes);

app.use("/api/blogs", blogRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ═══════════════════════════════════════════════════════════════════════════
// 5. GLOBAL ERROR HANDLER
// ═══════════════════════════════════════════════════════════════════════════
app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "Photo size is too large! Maximum limit is 2MB.",
    });
  } 
  
  // If CORS throws an error, return a clean 403 instead of crashing
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "Origin blocked by CORS policy",
    });
  }

  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
