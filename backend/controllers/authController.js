import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { TokenBlacklist } from '../models/TokenBlacklist.js';

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'bokul_rope_works_super_secret_jwt_key_2026_secured', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Login Admin / Owner
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password',
      });
    }

    // Check for user (include password for verification)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout User / Revoke & Blacklist JWT Token
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'No token provided for logout',
      });
    }

    // Decode token to find expiration date
    let expiresAt;
    try {
      const decoded = jwt.decode(token);
      if (decoded && decoded.exp) {
        expiresAt = new Date(decoded.exp * 1000);
      } else {
        expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days fallback
      }
    } catch (e) {
      expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }

    // Save token to blacklist
    await TokenBlacklist.create({
      token,
      expiresAt,
    });

    res.status(200).json({
      success: true,
      message: 'Successfully logged out. JWT Token has been blacklisted.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Current Logged-in User
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Seed Initial Admin Account if None Exists
// @route   POST /api/auth/seed
// @access  Public
export const seedAdmin = async (req, res, next) => {
  try {
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount > 0) {
      return res.status(200).json({
        success: true,
        message: 'Admin account already exists.',
      });
    }

    const defaultAdmin = await User.create({
      name: 'Bokul Rope Admin',
      email: 'admin@bokulrope.com',
      password: 'Admin@Bokul2026!',
      role: 'admin',
    });

    res.status(201).json({
      success: true,
      message: 'Default admin account created successfully.',
      adminEmail: defaultAdmin.email,
    });
  } catch (error) {
    next(error);
  }
};
