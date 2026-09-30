import Category from '../models/Category.js';
import ActivityLog from '../models/ActivityLog.js';

export const getCategories = async (req, res, next) => {
  try {
    const isPublic = !req.user;
    const filter = isPublic ? { isPublished: true } : {};
    const categories = await Category.find(filter).sort({ order: 1, createdAt: 1 });
    res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, description, order, isPublished } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    const category = await Category.create({
      name,
      slug,
      description,
      order: Number(order) || 0,
      isPublished: isPublished !== undefined ? isPublished : true,
    });

    await ActivityLog.create({
      action: `Created Category: ${name}`,
      category: 'Product',
      adminEmail: req.user?.email || 'admin@bokulrope.com',
    });

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { name, description, order, isPublished } = req.body;
    let updateFields = { description, order, isPublished };
    if (name) {
      updateFields.name = name;
      updateFields.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const category = await Category.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    await ActivityLog.create({
      action: `Updated Category: ${category.name}`,
      category: 'Product',
      adminEmail: req.user?.email || 'admin@bokulrope.com',
    });

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    await ActivityLog.create({
      action: `Deleted Category: ${category.name}`,
      category: 'Product',
      adminEmail: req.user?.email || 'admin@bokulrope.com',
    });

    res.status(200).json({ success: true, message: 'Category removed successfully' });
  } catch (error) {
    next(error);
  }
};
