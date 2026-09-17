import mongoose from 'mongoose';
import Product from '../models/Product.js';

// Pre-seeded fallback data for Bokul Rope Works
const SEED_PRODUCTS = [
  {
    _id: 'seed-1',
    name: '3-Strand Hawser Laid Jute Rope',
    category: 'Twisted Rope',
    description: 'High tensile strength 3-ply twisted golden jute rope crafted for industrial lashing, marine mooring, and general commercial usage.',
    diameterRange: '6mm to 40mm',
    ply: '3-Ply',
    applications: ['Marine & Shipping', 'Construction Scaffolding', 'Industrial Lashing', 'Agriculture'],
    moq: '500 kg',
    isFeatured: true,
  },
  {
    _id: 'seed-2',
    name: 'Heavy-Duty 4-Ply Industrial Cordage',
    category: 'Industrial Cordage',
    description: 'Dense, high-load jute cable constructed with 4 twisted strands for heavy-duty lifting, barrier ropes, and heavy payload binding.',
    diameterRange: '12mm to 50mm+',
    ply: '4-Ply',
    applications: ['Heavy Cargo Rigging', 'Quarry & Mining Binding', 'Architectural Barriers'],
    moq: '1000 kg',
    isFeatured: true,
  },
  {
    _id: 'seed-3',
    name: 'Eco-Friendly Packaging & Bundling Twine',
    category: 'Packaging Twine',
    description: '100% natural, biodegradable fine jute strings & yarns tailored for retail packaging, carton bundling, and nursery binding.',
    diameterRange: '1.5mm to 5mm',
    ply: '2-Ply / 3-Ply',
    applications: ['Export Packaging', 'Agricultural Binding', 'Handicrafts', 'Eco Retail'],
    moq: '250 kg',
    isFeatured: true,
  },
  {
    _id: 'seed-4',
    name: 'Custom Diameter & Treated Jute Ropes',
    category: 'Custom Order',
    description: 'Custom engineered jute ropes with specific twist pitch, cut lengths, oiled or unoiled finishes according to client specification.',
    diameterRange: '4mm to 60mm (Custom)',
    ply: 'Custom Plies',
    applications: ['Tender / OEM Specifications', 'Specialized Industrial Utility'],
    moq: 'Custom Batch',
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
      if (category) query.category = category;
      if (featured) query.isFeatured = featured === 'true';

      const products = await Product.find(query);
      if (products.length > 0) {
        return res.status(200).json({
          success: true,
          count: products.length,
          data: products,
        });
      }
    }

    // Fallback in-memory response
    let filtered = SEED_PRODUCTS;
    if (category) {
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
