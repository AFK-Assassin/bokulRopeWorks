import Product from '../models/Product.js';
import ActivityLog from '../models/ActivityLog.js';

export const getProducts = async (req, res, next) => {
  try {
    const { category, featured, search, status } = req.query;
    const isPublic = !req.user;
    
    let query = {};
    if (isPublic) {
      query.isPublished = true;
    } else if (status === 'published') {
      query.isPublished = true;
    } else if (status === 'draft') {
      query.isPublished = false;
    }

    if (category && category !== 'All') {
      query.category = { $regex: category, $options: 'i' };
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { material: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(query).sort({ order: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      category,
      shortDescription,
      description,
      material,
      ply,
      diameterRange,
      length,
      breakingStrength,
      color,
      packaging,
      moq,
      applications,
      technicalSpecs,
      imageUrl,
      isFeatured,
      isPublished,
      order,
    } = req.body;

    const slug = (req.body.slug || name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const product = await Product.create({
      name,
      slug,
      category: category || 'Jute Rope',
      shortDescription: shortDescription || '',
      description,
      material: material || '100% High-Grade Tossa / White Jute Fibre',
      ply: ply || '3-Ply Hawser Laid',
      diameterRange: diameterRange || '6mm - 40mm',
      length: length || '100m / 220m Coils',
      breakingStrength: breakingStrength || '1,900 - 2,400 kgf',
      color: color || 'Natural Golden Brown',
      packaging: packaging || 'Heavy-Duty Gunny Bundles',
      moq: moq || '500 kg',
      applications: Array.isArray(applications) ? applications : (applications ? applications.split(',').map(s => s.trim()) : []),
      technicalSpecs: technicalSpecs || {},
      imageUrl: imageUrl || '/images/bokul_rope_works_hero.webp',
      isFeatured: isFeatured !== undefined ? isFeatured : false,
      isPublished: isPublished !== undefined ? isPublished : true,
      order: Number(order) || 0,
    });

    await ActivityLog.create({
      action: `Created Product: ${name}`,
      category: 'Product',
      adminEmail: req.user?.email || 'admin@bokulrope.com',
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    let updateData = { ...req.body };
    if (updateData.applications && typeof updateData.applications === 'string') {
      updateData.applications = updateData.applications.split(',').map(s => s.trim());
    }
    if (updateData.name && !updateData.slug) {
      updateData.slug = updateData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await ActivityLog.create({
      action: `Updated Product: ${product.name}`,
      category: 'Product',
      adminEmail: req.user?.email || 'admin@bokulrope.com',
    });

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await ActivityLog.create({
      action: `Deleted Product: ${product.name}`,
      category: 'Product',
      adminEmail: req.user?.email || 'admin@bokulrope.com',
    });

    res.status(200).json({ success: true, message: 'Product removed from database' });
  } catch (error) {
    next(error);
  }
};
