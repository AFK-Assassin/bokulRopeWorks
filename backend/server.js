import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import { connectDB } from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import processRoutes from './routes/processRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import certificationRoutes from './routes/certificationRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { User } from './models/User.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// 1. CORS Configuration - MUST BE FIRST BEFORE ANY RATE LIMITERS OR HELMET
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, same-origin) or local development origins
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Enable preflight for all routes
app.options('*', cors());

// 2. HTTP Security Headers (Helmet)
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// 3. Global Rate Limiter for DDoS Protection (Skip OPTIONS preflight)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS',
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
});
app.use('/api', apiLimiter);

// 4. Strict Rate Limiter for Login & Inquiries (Skip OPTIONS preflight)
const strictAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  skip: (req) => req.method === 'OPTIONS',
  message: {
    success: false,
    message: 'Too many submission attempts. Please wait 15 minutes before trying again.',
  },
});
app.use('/api/auth/login', strictAuthLimiter);
app.use('/api/inquiries', strictAuthLimiter);

// 5. Payload Capping
app.use(express.json({ limit: '500kb' }));
app.use(express.urlencoded({ extended: true, limit: '500kb' }));

// 6. NoSQL Query Injection Protection
app.use(mongoSanitize());

// Base Route & Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'Bokul Rope Works API',
    security: 'CORS Enabled, DDoS Rate Limited & JWT Protected',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/process', processRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/activity', activityRoutes);

// Auto-seed Default Admin Account if none exists
const seedDefaultAdmin = async () => {
  try {
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount === 0) {
      await User.create({
        name: 'Bokul Rope Admin',
        email: 'admin@bokulrope.com',
        password: 'Admin@Bokul2026!',
        role: 'admin',
      });
      console.log('[Security] Created default admin account: admin@bokulrope.com');
    }
  } catch (err) {
    console.warn('[Security Seed Warning]:', err.message);
  }
};
setTimeout(seedDefaultAdmin, 3000);

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Error Handler Middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`[Server] Bokul Rope Works Secured Backend running on port ${PORT} (http://localhost:${PORT})`);
});
