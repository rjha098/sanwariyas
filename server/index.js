// THIS IS THE MAIN STARTING FILE OF ENTIRE BACKEND

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import adminRoutes from './routes/adminRoutes.js';

// All routes starting with /api/products are handled here
import productRoutes from './routes/productRoutes.js';
// All routes starting with /api/inquiry are handled here
import inquiryRoutes from './routes/inquiryRoutes.js';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// CORS configuration:
// - allow local development
// - allow the production Vercel domain
// - allow Vercel preview deployments for this project
const explicitAllowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://sanwariya-project.vercel.app',
  process.env.CLIENT_URL,
].filter(Boolean);

const vercelPreviewPattern = /^https:\/\/sanwariya-project-[a-z0-9-]+-projects\.vercel\.app$/;

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (explicitAllowedOrigins.includes(origin)) return true;
  return vercelPreviewPattern.test(origin);
};

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/inquiry', inquiryRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
