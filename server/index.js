// FILE:-   server/index.js

import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import { resumeInterruptedCatalogues } from "./services/lookbookPdfService.js";

import rateLimit from "express-rate-limit";
import { hide500Details } from "./middlewares/hide500Details.js";
import { makeRateLimitStore } from "./utils/mongoRateLimitStore.js";
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
// Log only error name/message/stack — never request bodies, headers or env.
const logFatal = (label, err) => {
  const e = err instanceof Error ? err : new Error(String(err));
  console.error(`[FATAL] ${label}: ${e.name}: ${e.message}\n${e.stack || ""}`);
};

// After an uncaught error the process state is undefined, so we do NOT keep
// running. Close the HTTP server gracefully, then exit(1) so PM2 / systemd /
// the host restarts a clean process. A hard timeout guarantees the exit.
let shuttingDown = false;
let httpServer = null;
const fatalExit = (label, err) => {
  logFatal(label, err);
  if (shuttingDown) return;
  shuttingDown = true;
  setTimeout(() => process.exit(1), 10000).unref();
  if (httpServer) httpServer.close(() => process.exit(1));
  else process.exit(1);
};

process.on("uncaughtException", (err) => fatalExit("uncaughtException", err));
process.on("unhandledRejection", (reason) =>
  fatalExit("unhandledRejection", reason),
);

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

app.set("trust proxy", 1);

connectDB();
mongoose.connection.once("open", () => {
  resumeInterruptedCatalogues();
});

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

// Vercel preview deployments look like
//   sanwariya-project-<hash>-<TEAM-SLUG>.vercel.app
// The old pattern accepted ANY team slug ending in "-projects", so anyone could
// create a Vercel project with a matching name and get a credentialed-CORS
// origin (refresh cookie is SameSite=None in production). Previews are now
// allowed ONLY for your own team slug, set via VERCEL_PREVIEW_SCOPE
// (e.g. "yourname-projects"). Unset = previews blocked.
const previewScope = (process.env.VERCEL_PREVIEW_SCOPE || "")
  .trim()
  .toLowerCase();
const vercelPreviewPattern = /^[a-z0-9-]+$/.test(previewScope)
  ? new RegExp(
      `^https://sanwariya-project-[a-z0-9-]+-${previewScope}\\.vercel\\.app$`,
    )
  : null;

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (explicitAllowedOrigins.includes(origin)) return true;
  return vercelPreviewPattern ? vercelPreviewPattern.test(origin) : false;
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
  store: makeRateLimitStore("auth"),
  passOnStoreError: true,
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
app.use("/api/", hide500Details);
app.use("/api/", generalLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/verify-otp", authLimiter);
app.use("/api/auth/customer/signup", authLimiter);
app.use("/api/auth/forgot-password", authLimiter);
app.use("/api/auth/verify-reset-code", authLimiter);
app.use("/api/auth/google", authLimiter);
app.use("/api/auth/password/set", authLimiter);

app.use("/api/inquiry/claim", authLimiter);
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

  if (Number.isInteger(err.status) && err.status >= 400 && err.status < 500) {
    return res.status(err.status).json({
      success: false,
      message:
        err.type === "entity.too.large"
          ? "Request body is too large."
          : err.type === "entity.parse.failed"
            ? "Invalid JSON in request body."
            : "Bad request.",
    });
  }

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "Origin blocked by CORS policy",
    });
  }

  // Log name/message/stack + route only — never headers, cookies or bodies.
  console.error(
    `[ERROR] ${req.method} ${req.path}: ${err?.name}: ${err?.message}\n${err?.stack || ""}`,
  );

  res.status(500).json({
    success: false,
    message: "Internal server error",
    // Internal error text is shown only outside production.
    ...(process.env.NODE_ENV !== "production" && { error: err?.message }),
  });
});

const PORT = process.env.PORT || 5000;
httpServer = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
