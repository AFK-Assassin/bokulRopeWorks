import WebsiteSettings from '../models/WebsiteSettings.js';
import ActivityLog from '../models/ActivityLog.js';

export const getSettings = async (req, res, next) => {
  try {
    let settings = await WebsiteSettings.findOne();
    if (!settings) {
      settings = await WebsiteSettings.create({});
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    let settings = await WebsiteSettings.findOne();
    if (!settings) {
      settings = await WebsiteSettings.create(req.body);
    } else {
      settings = await WebsiteSettings.findByIdAndUpdate(settings._id, req.body, {
        new: true,
        runValidators: true,
      });
    }

    await ActivityLog.create({
      action: 'Updated Website & Company Settings',
      category: 'Settings',
      adminEmail: req.user?.email || 'admin@bokulrope.com',
    });

    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};
