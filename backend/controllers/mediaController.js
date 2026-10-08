import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import Media from '../models/Media.js';
import ActivityLog from '../models/ActivityLog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directories exist
const backendUploadDir = path.join(__dirname, '..', 'uploads');
const frontendUploadDir = path.join(__dirname, '..', '..', 'frontend', 'public', 'uploads');

if (!fs.existsSync(backendUploadDir)) {
  fs.mkdirSync(backendUploadDir, { recursive: true });
}
if (!fs.existsSync(frontendUploadDir)) {
  try {
    fs.mkdirSync(frontendUploadDir, { recursive: true });
  } catch (e) {
    console.warn('Frontend upload dir note:', e.message);
  }
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, backendUploadDir);
  },
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const finalName = `${uniqueSuffix}-${cleanName}`;
    cb(null, finalName);
  },
});

const fileFilter = (req, file, cb) => {
  const isImageMime = file.mimetype && file.mimetype.startsWith('image/');
  const isPdf = file.mimetype === 'application/pdf';
  const isImageExt = /\.(jpg|jpeg|png|webp|gif|svg|bmp|tiff|tif|avif|heic|heif|ico|jfif)$/i.test(
    file.originalname || ''
  );

  if (isImageMime || isPdf || isImageExt) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPG, JPEG, PNG, WEBP, GIF, SVG, etc.) and PDFs are allowed!'), false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter,
});

export const getMedia = async (req, res, next) => {
  try {
    const { search, fileType } = req.query;
    let query = {};
    if (fileType) query.fileType = fileType;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { filename: { $regex: search, $options: 'i' } },
      ];
    }

    let items = await Media.find(query).sort({ createdAt: -1 });

    // If empty, populate existing mill image assets
    if (items.length === 0 && !search && !fileType) {
      const defaultMedia = [
        { title: 'BRW Mill Circular Logo', filename: 'BRW-logo.webp', url: '/images/BRW-logo.webp', fileType: 'image' },
        { title: 'Bokul Rope Works Mill Hero', filename: 'bokul_rope_works_hero.webp', url: '/images/bokul_rope_works_hero.webp', fileType: 'image' },
        { title: 'Manufacturing Process Facility', filename: 'bokul_rope_works_process.webp', url: '/images/bokul_rope_works_process.webp', fileType: 'image' },
        { title: 'Mill Machinery & High-Torque Twister', filename: 'Mill_2.webp', url: '/images/Mill_2.webp', fileType: 'image' },
        { title: '20mm Manila Rope Batch', filename: '20mm-manila-rope-250x250.webp', url: '/images/20mm-manila-rope-250x250.webp', fileType: 'image' },
        { title: '2000 Tex Natural Sisal Yarn', filename: '2000-tex-single-ply-natural-sisal-yarn-250x250.webp', url: '/images/2000-tex-single-ply-natural-sisal-yarn-250x250.webp', fileType: 'image' },
        { title: '10 Lbs Jute Twine Sutli', filename: '10lbs-jute-twine-sutli-250x250.webp', url: '/images/10lbs-jute-twine-sutli-250x250.webp', fileType: 'image' },
        { title: '2mm Jute Baan Cordage', filename: '2mm-jute-ban-250x250.webp', url: '/images/2mm-jute-ban-250x250.webp', fileType: 'image' },
        { title: '3-Ply Jute Line Ropes', filename: '3-ply-jute-line-250x250.webp', url: '/images/3-ply-jute-line-250x250.webp', fileType: 'image' },
        { title: 'High-Density Coiling Section', filename: 'Coil_mc.webp', url: '/images/Coil_mc.webp', fileType: 'image' },
        { title: 'Bulk Burlap Sacks & Packaging Unit', filename: 'Packaging.webp', url: '/images/Packaging.webp', fileType: 'image' },
        { title: 'Spun Jute Yarn Coils', filename: 'jute_yarn.webp', url: '/images/jute_yarn.webp', fileType: 'image' },
      ];

      try {
        await Media.insertMany(defaultMedia);
        items = await Media.find(query).sort({ createdAt: -1 });
      } catch (seedErr) {
        console.warn('Media auto-seed note:', seedErr.message);
      }
    }

    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    next(error);
  }
};

export const createMedia = async (req, res, next) => {
  try {
    const { title, filename, url, fileType, fileSize, altText } = req.body;
    if (!title || !url) {
      return res.status(400).json({ success: false, message: 'Title and URL are required' });
    }

    const item = await Media.create({
      title,
      filename: filename || url.split('/').pop() || 'asset',
      url,
      fileType: fileType || 'image',
      fileSize: fileSize || 0,
      altText: altText || title,
    });

    await ActivityLog.create({
      action: `Uploaded Media Asset: ${title}`,
      category: 'Media',
      adminEmail: req.user?.email || 'admin@bokulrope.com',
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const uploadMediaFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const filename = req.file.filename;
    const title = req.body.title || req.file.originalname.replace(/\.[^/.]+$/, '');
    const altText = req.body.altText || title;
    const fileType = req.file.mimetype.startsWith('image/') ? 'image' : 'pdf';
    const url = `/uploads/${filename}`;

    // Also copy to frontend/public/uploads if it exists for seamless development Vite access
    try {
      if (fs.existsSync(path.dirname(frontendUploadDir))) {
        fs.copyFileSync(
          path.join(backendUploadDir, filename),
          path.join(frontendUploadDir, filename)
        );
      }
    } catch (copyErr) {
      console.warn('File copy to frontend public warning:', copyErr.message);
    }

    const item = await Media.create({
      title,
      filename,
      url,
      fileType,
      fileSize: req.file.size,
      altText,
    });

    await ActivityLog.create({
      action: `Uploaded File Asset: ${title} (${filename})`,
      category: 'Media',
      adminEmail: req.user?.email || 'admin@bokulrope.com',
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const deleteMedia = async (req, res, next) => {
  try {
    const item = await Media.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Media item not found' });
    }

    // Try deleting physical file if in uploads
    if (item.filename && item.url && item.url.startsWith('/uploads/')) {
      const filePath = path.join(backendUploadDir, item.filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.warn('Physical file deletion warning:', e.message);
        }
      }
      const frontendFilePath = path.join(frontendUploadDir, item.filename);
      if (fs.existsSync(frontendFilePath)) {
        try {
          fs.unlinkSync(frontendFilePath);
        } catch (e) {
          console.warn('Frontend file deletion warning:', e.message);
        }
      }
    }

    await ActivityLog.create({
      action: `Deleted Media Asset: ${item.title}`,
      category: 'Media',
      adminEmail: req.user?.email || 'admin@bokulrope.com',
    });

    res.status(200).json({ success: true, message: 'Media removed from library' });
  } catch (error) {
    next(error);
  }
};
