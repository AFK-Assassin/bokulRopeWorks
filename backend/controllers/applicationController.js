import Application from '../models/Application.js';
import ActivityLog from '../models/ActivityLog.js';

export const getApplications = async (req, res, next) => {
  try {
    const isPublic = !req.user;
    const filter = isPublic ? { isPublished: true } : {};
    const applications = await Application.find(filter).sort({ order: 1, createdAt: 1 });
    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    next(error);
  }
};

export const createApplication = async (req, res, next) => {
  try {
    const { title, description, suitableProducts, benefits, imageUrl, order, isPublished } = req.body;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const appItem = await Application.create({
      title,
      slug,
      description,
      suitableProducts: Array.isArray(suitableProducts) ? suitableProducts : (suitableProducts ? suitableProducts.split(',').map(s => s.trim()) : []),
      benefits: Array.isArray(benefits) ? benefits : (benefits ? benefits.split(',').map(s => s.trim()) : []),
      imageUrl: imageUrl || '/images/bokul_rope_works_hero.webp',
      order: Number(order) || 0,
      isPublished: isPublished !== undefined ? isPublished : true,
    });

    await ActivityLog.create({
      action: `Created Sector Application: ${title}`,
      category: 'Application',
      adminEmail: req.user?.email || 'admin@bokulrope.com',
    });

    res.status(201).json({ success: true, data: appItem });
  } catch (error) {
    next(error);
  }
};

export const updateApplication = async (req, res, next) => {
  try {
    const { title, description, suitableProducts, benefits, imageUrl, order, isPublished } = req.body;
    let updateFields = {
      ...(description && { description }),
      ...(imageUrl && { imageUrl }),
      ...(suitableProducts && {
        suitableProducts: Array.isArray(suitableProducts) ? suitableProducts : suitableProducts.split(',').map(s => s.trim()),
      }),
      ...(benefits && {
        benefits: Array.isArray(benefits) ? benefits : benefits.split(',').map(s => s.trim()),
      }),
      ...(order !== undefined && { order: Number(order) }),
      ...(isPublished !== undefined && { isPublished }),
    };

    if (title) {
      updateFields.title = title;
      updateFields.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const appItem = await Application.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!appItem) {
      return res.status(404).json({ success: false, message: 'Application item not found' });
    }

    await ActivityLog.create({
      action: `Updated Sector Application: ${appItem.title}`,
      category: 'Application',
      adminEmail: req.user?.email || 'admin@bokulrope.com',
    });

    res.status(200).json({ success: true, data: appItem });
  } catch (error) {
    next(error);
  }
};

export const deleteApplication = async (req, res, next) => {
  try {
    const appItem = await Application.findByIdAndDelete(req.params.id);
    if (!appItem) {
      return res.status(404).json({ success: false, message: 'Application item not found' });
    }

    await ActivityLog.create({
      action: `Deleted Sector Application: ${appItem.title}`,
      category: 'Application',
      adminEmail: req.user?.email || 'admin@bokulrope.com',
    });

    res.status(200).json({ success: true, message: 'Application item removed successfully' });
  } catch (error) {
    next(error);
  }
};
