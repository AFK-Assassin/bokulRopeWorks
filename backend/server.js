import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
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
import standardRoutes from './routes/standardRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { User } from './models/User.js';
import { seedInitialData } from './services/seedService.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// 1. CORS Configuration - MUST BE FIRST BEFORE ANY RATE LIMITERS OR HELMET
const isProduction = process.env.NODE_ENV === 'production';

const productionOrigins = [
  'https://bokulropeworks.com',
  'https://www.bokulropeworks.com',
  process.env.CLIENT_URL,
].filter(Boolean);

const developmentOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

const allowedOrigins = isProduction ? productionOrigins : developmentOrigins;

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      
      const isAllowed =
        allowedOrigins.includes(origin) ||
        origin.endsWith('.pages.dev') ||
        origin.endsWith('.workers.dev') ||
        origin.endsWith('.vercel.app') ||
        (!isProduction && origin.startsWith('http://localhost:'));
      if (isAllowed) {
        callback(null, true);
      } else {
        // Return false without throwing an internal exception
        callback(null, false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Enable preflight for all routes
app.options('*', cors());

// 2. HTTP Security Headers (Helmet) with tailored CSP
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: isProduction ? {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        imgSrc: ["'self'", 'data:', 'blob:', 'https://bokulropeworks.com'],
        connectSrc: ["'self'", 'https://bokulropeworks.com'],
        objectSrc: ["'none'"],
        frameAncestors: ["'self'"],
      },
    } : false,
  })
);

// 3. Static Uploads Folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 4. Global Rate Limiter for DDoS Protection (Skip OPTIONS preflight)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 600,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS',
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
});
app.use('/api', apiLimiter);

// 5. Strict Rate Limiter for Login & Inquiries (Skip OPTIONS preflight)
const strictAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  skip: (req) => req.method === 'OPTIONS',
  message: {
    success: false,
    message: 'Too many submission attempts. Please wait 15 minutes before trying again.',
  },
});
app.use('/api/auth/login', strictAuthLimiter);
app.use('/api/inquiries', strictAuthLimiter);

// 6. Payload Capping
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 7. NoSQL Query Injection Protection
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
app.use('/api/standards', standardRoutes);

// Auto-seed Default Admin Account & Initial Mill Data if empty
const seedDefaultAdmin = async () => {
  try {
    const adminCount = await User.countDocuments({ role: { $in: ['admin', 'owner'] } });
    const seedEmail = process.env.ADMIN_SEED_EMAIL;
    const seedPassword = process.env.ADMIN_SEED_PASSWORD;

    if (adminCount === 0 && seedEmail && seedPassword) {
      await User.create({
        name: 'Bokul Rope Admin',
        email: seedEmail.toLowerCase(),
        password: seedPassword,
        role: 'admin',
      });
      console.log(`[Security] Created default admin account: ${seedEmail}`);
    } else if (adminCount === 0) {
      console.log('[Security] Admin seed skipped: ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD env variables not configured.');
    }
    await seedInitialData();
  } catch (err) {
    console.warn('[Security Seed Warning]:', err.message);
  }
};
setTimeout(seedDefaultAdmin, 2000);

// Serve static frontend build if present (e.g. monolithic or single-container production deployment)
const frontendDist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// 404 Handler for API and unhandled requests
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
  console.log(`[Server] Bokul Rope Works Secured Backend running on port ${PORT} (http://localhost:${PORT}) - Standards API Active`);
});
