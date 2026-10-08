import TechnicalStandard from '../models/TechnicalStandard.js';
import ActivityLog from '../models/ActivityLog.js';

export const getTechnicalStandards = async (req, res, next) => {
  try {
    const isPublic = !req.user;
    const filter = isPublic ? { isPublished: true } : {};
    const standards = await TechnicalStandard.find(filter).sort({ order: 1, createdAt: 1 });
    res.status(200).json({ success: true, count: standards.length, data: standards });
  } catch (error) {
    next(error);
  }
};

export const createTechnicalStandard = async (req, res, next) => {
  try {
    const { diameter, plies, approxWeight, breakingLoad, primaryUse, isPublished, order } = req.body;
    const standard = await TechnicalStandard.create({
      diameter,
      plies: plies || '3-Strand',
      approxWeight,
      breakingLoad,
      primaryUse,
      isPublished: isPublished !== undefined ? isPublished : true,
      order: Number(order) || 0,
    });

    await ActivityLog.create({
      action: `Added Technical Standard: ${diameter}`,
      category: 'TechnicalStandards',
      adminEmail: req.user?.email || 'admin@bokulrope.com',
    });

    res.status(201).json({ success: true, data: standard });
  } catch (error) {
    next(error);
  }
};

export const updateTechnicalStandard = async (req, res, next) => {
  try {
    const { diameter, plies, approxWeight, breakingLoad, primaryUse, isPublished, order } = req.body;
    const updateData = {
      ...(diameter && { diameter }),
      ...(plies && { plies }),
      ...(approxWeight && { approxWeight }),
      ...(breakingLoad && { breakingLoad }),
      ...(primaryUse && { primaryUse }),
      ...(isPublished !== undefined && { isPublished }),
      ...(order !== undefined && { order: Number(order) }),
    };

    const standard = await TechnicalStandard.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!standard) {
      return res.status(404).json({ success: false, message: 'Technical standard record not found' });
    }

    await ActivityLog.create({
      action: `Updated Technical Standard: ${standard.diameter}`,
      category: 'TechnicalStandards',
      adminEmail: req.user?.email || 'admin@bokulrope.com',
    });

    res.status(200).json({ success: true, data: standard });
  } catch (error) {
    next(error);
  }
};

export const deleteTechnicalStandard = async (req, res, next) => {
  try {
    const standard = await TechnicalStandard.findByIdAndDelete(req.params.id);
    if (!standard) {
      return res.status(404).json({ success: false, message: 'Technical standard not found' });
    }

    await ActivityLog.create({
      action: `Deleted Technical Standard: ${standard.diameter}`,
      category: 'TechnicalStandards',
      adminEmail: req.user?.email || 'admin@bokulrope.com',
    });

    res.status(200).json({ success: true, message: 'Technical standard removed successfully' });
  } catch (error) {
    next(error);
  }
};
