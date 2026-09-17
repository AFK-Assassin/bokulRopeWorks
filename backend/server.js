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
import { errorHandler } from './middleware/errorHandler.js';
import { User } from './models/User.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// 1. HTTP Security Headers (Helmet)
app.use(helmet());

// 2. Global Rate Limiter for DDoS Protection
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes (DDoS protection enabled).',
  },
});
app.use('/api', apiLimiter);

// 3. Strict Rate Limiter for Authentication & Inquiry Submissions
const strictAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per 15 minutes
  message: {
    success: false,
    message: 'Too many submission attempts. Please wait 15 minutes before trying again.',
  },
});
app.use('/api/auth/login', strictAuthLimiter);
app.use('/api/inquiries', strictAuthLimiter);

// 4. CORS Configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// 5. Payload Capping to prevent Buffer Overflow / Memory Exhaustion
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 6. NoSQL Query Injection Protection
app.use(mongoSanitize());

// Base Route & Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'Bokul Rope Works API',
    security: 'DDoS Rate Limited & JWT Protected',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inquiries', inquiryRoutes);

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
