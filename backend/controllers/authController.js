import { User } from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';
import { TokenBlacklist } from '../models/TokenBlacklist.js';
import jwt from 'jsonwebtoken';

const getSignedJwtToken = (user) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is missing.');
  }
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    secret,
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
      action: `Admin / Owner Logged In (${user.name || user.email})`,
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
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.decode(token);
        const expiresAt = decoded && decoded.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 24 * 60 * 60 * 1000);
        await TokenBlacklist.findOneAndUpdate(
          { token },
          { token, expiresAt },
          { upsert: true, new: true }
        );
      } catch (blacklistErr) {
        console.warn('[Auth Warning] Token blacklist entry note:', blacklistErr.message);
      }
    }

    if (req.user) {
      await ActivityLog.create({
        action: `Admin / Owner Logged Out (${req.user.email})`,
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
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAdmins = async (req, res, next) => {
  try {
    const users = await User.find({ role: { $in: ['admin', 'owner'] } })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An administrator or owner with this email already exists',
      });
    }

    // Only existing owners can assign the 'owner' role to new accounts
    const assignedRole = (role === 'owner' && req.user?.role === 'owner') ? 'owner' : 'admin';

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: assignedRole,
    });

    await ActivityLog.create({
      action: `Created new Administrator/Owner account: ${user.name} (${user.email})`,
      category: 'Auth',
      adminEmail: req.user?.email || 'System',
    });

    res.status(201).json({
      success: true,
      message: 'New administrator added successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAdmin = async (req, res, next) => {
  try {
    const targetId = req.params.id;

    if (req.user.id === targetId || req.user._id?.toString() === targetId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own active administrator account',
      });
    }

    const totalAdmins = await User.countDocuments({ role: { $in: ['admin', 'owner'] } });
    if (totalAdmins <= 1) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete the only remaining administrator account on the system',
      });
    }

    const targetUser = await User.findByIdAndDelete(targetId);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'Administrator not found' });
    }

    await ActivityLog.create({
      action: `Deleted Administrator/Owner account: ${targetUser.name} (${targetUser.email})`,
      category: 'Auth',
      adminEmail: req.user.email,
    });

    res.status(200).json({
      success: true,
      message: 'Administrator account removed successfully',
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
      action: `Updated Profile Details (${user.name})`,
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
      action: `Changed Security Password (${user.email})`,
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
