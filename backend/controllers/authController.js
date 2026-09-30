import { User } from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const getSignedJwtToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET || 'bokul_industrial_rope_jwt_secret_key_2026_super_secure',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = getSignedJwtToken(user);

    await ActivityLog.create({
      action: 'Admin / Owner Logged In',
      category: 'Auth',
      adminEmail: user.email,
    });

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

export const logout = async (req, res, next) => {
  try {
    if (req.user) {
      await ActivityLog.create({
        action: 'Admin / Owner Logged Out',
        category: 'Auth',
        adminEmail: req.user.email,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
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

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    await user.save();

    await ActivityLog.create({
      action: 'Updated Owner Profile Details',
      category: 'Auth',
      adminEmail: user.email,
    });

    res.status(200).json({
      success: true,
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

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current and new password',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
      });
    }

    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password does not match',
      });
    }

    user.password = newPassword;
    await user.save();

    await ActivityLog.create({
      action: 'Changed Security Password',
      category: 'Auth',
      adminEmail: user.email,
    });

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const seedAdmin = async (req, res, next) => {
  try {
    let admin = await User.findOne({ email: 'admin@bokulrope.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Bokul Rope Admin',
        email: 'admin@bokulrope.com',
        password: 'Admin@Bokul2026!',
        role: 'admin',
      });
      return res.status(201).json({ success: true, message: 'Admin account created', user: admin });
    }
    res.status(200).json({ success: true, message: 'Admin account already exists', user: admin });
  } catch (error) {
    next(error);
  }
};
