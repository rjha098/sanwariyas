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

dotenv.config();

const app = express();
connectDB();

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
app.use('/api/notification', notificationRoutes); // ← ADD KIYA

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});