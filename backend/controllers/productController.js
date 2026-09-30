import mongoose from 'mongoose';
import Product from '../models/Product.js';

// Pre-seeded default data with online images for Bokul Rope Works
let SEED_PRODUCTS = [
  {
    _id: 'prod-1',
    name: '3-Strand Hawser Laid Jute Rope',
    category: 'Jute Ropes',
    description: 'Commercial grade 3-ply twisted golden jute rope crafted for industrial lashing, marine mooring, scaffolding, and general commercial usage.',
    diameterRange: '6mm to 40mm',
    ply: '3-Ply',
    applications: ['Marine & Shipping', 'Construction Scaffolding', 'Industrial Lashing', 'Agriculture'],
    moq: '500 kg',
    imageUrl: '/images/jute_rope_3strand.jpg',
    isFeatured: true,
  },
  {
    _id: 'prod-2',
    name: 'Heavy-Duty 4-Ply Industrial Cordage',
    category: 'Jute Ropes',
    description: 'Dense, high-load jute cable constructed with 4 twisted strands for heavy-duty lifting, barrier ropes, and heavy payload binding.',
    diameterRange: '12mm to 50mm+',
    ply: '4-Ply',
    applications: ['Heavy Cargo Rigging', 'Quarry & Mining Binding', 'Architectural Barriers'],
    moq: '1000 kg',
    imageUrl: '/images/industrial_cordage_4ply.jpg',
    isFeatured: true,
  },
  {
    _id: 'prod-3',
    name: 'Pure Manila Ropes (Abaca Fibre)',
    category: 'Manila & Sisal',
    description: 'Premium Grade-1 natural abaca manila cordage offering unmatched tensile strength, minimal stretch, and firm non-slip grip for maritime & lifting.',
    diameterRange: '6mm to 48mm+',
    ply: '3-Ply / 4-Ply',
    applications: ['Marine Mooring & Towing', 'Ship Chandling', 'Heavy Lifting Slings', 'Climbing Ropes'],
    moq: '500 kg',
    imageUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
  },
  {
    _id: 'prod-4',
    name: 'Industrial Sisal Ropes & Cordage',
    category: 'Manila & Sisal',
    description: 'Stiff, high-friction natural sisal agave ropes engineered for extreme surface abrasion resistance, agricultural baling, and oilfield cordage.',
    diameterRange: '4mm to 36mm',
    ply: '3-Ply / 4-Ply',
    applications: ['Agricultural Baling', 'Oilfield Utility', 'Pet Scratching Posts', 'Industrial Binding'],
    moq: '400 kg',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
  },
  {
    _id: 'prod-5',
    name: 'Precision-Spun Jute Yarn',
    category: 'Yarn & Twines',
    description: 'Uniform count, high-tenacity Bengal jute yarns spun on modern frames for carpet weaving, cable core filler, and sacking cloth manufacturing.',
    diameterRange: 'Count: 4.8 - 36 lbs / Spindle',
    ply: 'Single / Multi-End',
    applications: ['Carpet Backing & Weaving', 'Cable Core Filler', 'Sacking Weft/Warp', 'Industrial Stitching'],
    moq: '500 kg',
    imageUrl: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
  },
  {
    _id: 'prod-6',
    name: 'Eco-Friendly Jute Packaging Twines',
    category: 'Yarn & Twines',
    description: 'Smooth finished fine jute strings & cordage ideal for agricultural binding, retail packaging, and export carton strapping.',
    diameterRange: '1.5mm to 5mm',
    ply: '2-Ply / 3-Ply / 4-Ply',
    applications: ['Export Packaging', 'Agricultural Binding', 'Handicrafts', 'Eco Retail'],
    moq: '250 kg',
    imageUrl: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
  },
  {
    _id: 'prod-7',
    name: 'Traditional Jute Baan Ropes',
    category: 'Baan & Line Ropes',
    description: 'Tightly spun, resilient natural jute baan rope designed for traditional charpai / cot weaving, agricultural bundling, and rural utility.',
    diameterRange: '3mm to 8mm',
    ply: 'High-Twist Baan',
    applications: ['Charpai / Cot Weaving', 'Rural Fencing', 'Grain Sack Binding', 'Handmade Furniture'],
    moq: '300 kg',
    imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
  },
  {
    _id: 'prod-8',
    name: 'Precision Line Ropes',
    category: 'Baan & Line Ropes',
    description: 'Calibrated low-stretch line cordage engineered for construction plumb alignment, marine sounding lines, and surveying chalk lines.',
    diameterRange: '2mm to 10mm',
    ply: '3-Ply / 4-Ply',
    applications: ['Masonry Guide Lines', 'Marine Sounding Lines', 'Surveying Chalk Lines', 'Pulley Cordage'],
    moq: '250 kg',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    isFeatured: false,
  },
  {
    _id: 'prod-9',
    name: 'Marine & Industrial Spunyarn',
    category: 'Spunyarn',
    description: 'Traditional 2-ply to 4-ply long-staple spunyarn (tarred or natural) for marine seizing, rigging protection, and pipe caulking.',
    diameterRange: '2-Ply, 3-Ply, 4-Ply',
    ply: '2 to 4 Strands',
    applications: ['Marine Rigging Seizing', 'Pipe Joint Caulking', 'Boat Seam Packing', 'Heavy Weatherproof Ties'],
    moq: '200 kg',
    imageUrl: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
  },
  {
    _id: 'prod-10',
    name: 'Natural Jute Carpets, Rugs & Geotextile Mats',
    category: 'Carpets & Mats',
    description: 'Handwoven & machine-loomed natural jute floor carpets, bouclé rugs, hallway runners, and civil geotextile mats.',
    diameterRange: 'Custom Roll Widths & Cut Rugs',
    ply: 'Woven & Braided',
    applications: ['Home & Hotel Carpets', 'Office Runners', 'Geotextile Soil Stabilization', 'Eco Events'],
    moq: '100 sq.m',
    imageUrl: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
  },
  {
    _id: 'prod-11',
    name: 'Burlap Jute Bags & Heavy Gunny Sacks',
    category: 'Jute Bags',
    description: 'Heavy-duty A-Twill, B-Twill, and D.W. burlap jute sacks manufactured for bulk grain storage, coffee/cocoa export, and flood-control sandbags.',
    diameterRange: '50kg, 90kg, 100kg Capacity',
    ply: 'Heavy Twill Woven',
    applications: ['Food Grain Storage', 'Coffee/Cocoa Export', 'Produce Transport', 'Flood Sandbags'],
    moq: '1,000 Bags',
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
  },
  {
    _id: 'prod-12',
    name: 'Custom Engineered OEM Specifications',
    category: 'Custom OEM',
    description: 'Custom engineered cordage, twines, yarns, and sacking with bespoke pitch, dimensions, and finishes as per client specification.',
    diameterRange: '2mm to 65mm (Custom)',
    ply: 'Custom Plies',
    applications: ['Tender / OEM Specifications', 'Specialized Industrial Utility'],
    moq: 'Custom Batch',
    imageUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=80',
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
