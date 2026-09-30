import ActivityLog from '../models/ActivityLog.js';

export const getActivities = async (req, res, next) => {
  try {
    const { limit = 50, category } = req.query;
    let query = {};
    if (category) query.category = category;

    const logs = await ActivityLog.find(query).sort({ createdAt: -1 }).limit(Number(limit));
    res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    next(error);
  }
};
