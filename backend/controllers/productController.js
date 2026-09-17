import mongoose from 'mongoose';
import Product from '../models/Product.js';

// Pre-seeded default data with online images for Bokul Rope Works
let SEED_PRODUCTS = [
  {
    _id: 'prod-1',
    name: '3-Strand Hawser Laid Jute Rope',
    category: 'Twisted Ropes',
    description: 'High tensile strength 3-ply twisted golden jute rope crafted for industrial lashing, marine mooring, and general commercial usage.',
    diameterRange: '6mm to 40mm',
    ply: '3-Ply',
    applications: ['Marine & Shipping', 'Construction Scaffolding', 'Industrial Lashing', 'Agriculture'],
    moq: '500 kg',
    imageUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
  },
  {
    _id: 'prod-2',
    name: 'Heavy-Duty 4-Ply Industrial Cordage',
    category: 'Industrial Cordage',
    description: 'Dense, high-load jute cable constructed with 4 twisted strands for heavy-duty lifting, barrier ropes, and heavy payload binding.',
    diameterRange: '12mm to 50mm+',
    ply: '4-Ply',
    applications: ['Heavy Cargo Rigging', 'Quarry & Mining Binding', 'Architectural Barriers'],
    moq: '1000 kg',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
  },
  {
    _id: 'prod-3',
    name: 'Eco-Friendly Packaging & Bundling Twine',
    category: 'Packaging Twines',
    description: '100% natural, biodegradable fine jute strings & yarns tailored for retail packaging, carton bundling, and nursery binding.',
    diameterRange: '1.5mm to 5mm',
    ply: '2-Ply / 3-Ply',
    applications: ['Export Packaging', 'Agricultural Binding', 'Handicrafts', 'Eco Retail'],
    moq: '250 kg',
    imageUrl: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
  },
  {
    _id: 'prod-4',
    name: 'Custom Diameter & Treated Jute Ropes',
    category: 'Custom Orders',
    description: 'Custom engineered jute ropes with specific twist pitch, cut lengths, oiled or unoiled finishes according to client specification.',
    diameterRange: '4mm to 60mm (Custom)',
    ply: 'Custom Plies',
    applications: ['Tender / OEM Specifications', 'Specialized Industrial Utility'],
    moq: 'Custom Batch',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    isFeatured: false,
  },
];

// @desc    Get all products
// @route   GET /api/products
export const getProducts = async (req, res, next) => {
  try {
    const { category, featured } = req.query;

    if (mongoose.connection.readyState === 1) {
      let query = {};
      if (category && category !== 'All') query.category = category;
      if (featured) query.isFeatured = featured === 'true';

      const products = await Product.find(query).sort({ createdAt: -1 });
      if (products.length > 0) {
        return res.status(200).json({
          success: true,
          count: products.length,
          data: products,
        });
      }
    }

    let filtered = SEED_PRODUCTS;
    if (category && category !== 'All') {
      filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    if (featured) {
      filtered = filtered.filter((p) => p.isFeatured === (featured === 'true'));
    }

    res.status(200).json({
      success: true,
      count: filtered.length,
      data: filtered,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      const product = await Product.findById(id);
      if (product) {
        return res.status(200).json({ success: true, data: product });
      }
    }

    const fallbackProduct = SEED_PRODUCTS.find((p) => p._id === id);
    if (!fallbackProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, data: fallbackProduct });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product (Admin)
// @route   POST /api/products
export const createProduct = async (req, res, next) => {
  try {
    const { name, category, description, diameterRange, ply, applications, moq, imageUrl, isFeatured } = req.body;

    if (!name || !description) {
      return res.status(400).json({ success: false, message: 'Product name and description are required.' });
    }

    const newProductPayload = {
      name,
      category: category || 'Twisted Ropes',
      description,
      diameterRange: diameterRange || '6mm - 40mm',
      ply: ply || '3-Ply',
      applications: Array.isArray(applications) ? applications : (applications ? applications.split(',').map(s => s.trim()) : []),
      moq: moq || '500 kg',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=80',
      isFeatured: isFeatured || false,
    };

    if (mongoose.connection.readyState === 1) {
      const product = await Product.create(newProductPayload);
      return res.status(201).json({ success: true, data: product, message: 'Product created successfully' });
    }

    newProductPayload._id = `prod-${Date.now()}`;
    SEED_PRODUCTS.unshift(newProductPayload);

    return res.status(201).json({ success: true, data: newProductPayload, message: 'Product created successfully (Memory)' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      const updated = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      if (updated) {
        return res.status(200).json({ success: true, data: updated, message: 'Product updated successfully' });
      }
    }

    const idx = SEED_PRODUCTS.findIndex((p) => p._id === id);
    if (idx !== -1) {
      SEED_PRODUCTS[idx] = { ...SEED_PRODUCTS[idx], ...req.body };
      return res.status(200).json({ success: true, data: SEED_PRODUCTS[idx], message: 'Product updated successfully' });
    }

    return res.status(404).json({ success: false, message: 'Product not found' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      await Product.findByIdAndDelete(id);
      return res.status(200).json({ success: true, message: 'Product deleted successfully' });
    }

    SEED_PRODUCTS = SEED_PRODUCTS.filter((p) => p._id !== id);
    return res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};
