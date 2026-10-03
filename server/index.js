// FILE:-   server/index.js

import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";
import lookbookRoutes from "./routes/lookbookRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import instagramRoutes from "./routes/instagramRoutes.js";

dotenv.config();

// ═══════════════════════════════════════════════════════════════════════════
// PROCESS-LEVEL SAFETY NET
// ═══════════════════════════════════════════════════════════════════════════
process.on("uncaughtException", (err) => {
  // console.error("UNCAUGHT EXCEPTION — server stayed alive, but fix this:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  // console.error(
  //   "UNHANDLED PROMISE REJECTION — server stayed alive, but fix this:",
  //   reason,
  // );
});

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

app.set("trust proxy", 1);

connectDB();

// ═══════════════════════════════════════════════════════════════════════════
// 1. CORS MIDDLEWARE
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
// IMPORTANT: Cashfree's webhook signature is calculated over the exact raw
// bytes of the request body. If express.json() parses it first, we lose
// that raw string and signature verification will always fail. So this
// ONE route gets the raw body captured before the general JSON parser runs.
app.use(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  (req, res, next) => {
    req.rawBody = req.body.toString("utf8");
    next();
  },
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());

app.use("/uploads", express.static("uploads"));

// ═══════════════════════════════════════════════════════════════════════════
// 3. RATE LIMITING (ENTERPRISE ISOLATION)
// ═══════════════════════════════════════════════════════════════════════════
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts. Please try again in a few minutes.",
  },
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  skip: (req) => {
    return (
      req.path.includes("/auth/session") ||
      req.path.includes("/auth/heartbeat") ||
      req.path.includes("/notification/unread-count") ||
      req.path.includes("/auth/visibility")
    );
  },
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please slow down." },
});

// Dedicated relaxed limiter for rapid F5 mashing and dashboard polling
const highFreqLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many background requests. Please slow down.",
  },
});

const notificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please slow down." },
});

// Apply Limiters
app.use("/api/", generalLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/verify-otp", authLimiter);
app.use("/api/auth/customer/signup", authLimiter);
app.use("/api/auth/forgot-password", authLimiter);
app.use("/api/auth/reset-password", authLimiter);

app.use("/api/auth/session", highFreqLimiter);
app.use("/api/auth/heartbeat", highFreqLimiter);

// ═══════════════════════════════════════════════════════════════════════════
// 4. ROUTES
// ═══════════════════════════════════════════════════════════════════════════
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/inquiry", inquiryRoutes);
app.use("/api/lookbook", lookbookRoutes);
app.use("/api/notification", notificationLimiter, notificationRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/instagram", instagramRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

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

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "Origin blocked by CORS policy",
    });
  }

  // console.error(err.stack);

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  // console.log(`Server running on http://localhost:${PORT}`);
});