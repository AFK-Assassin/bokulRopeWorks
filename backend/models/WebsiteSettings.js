import mongoose from 'mongoose';

const websiteSettingsSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      default: 'Bokul Rope Works',
    },
    tagline: {
      type: String,
      default: '100% Pure Natural Fibre Cordage & Jute Rope Manufacturers',
    },
    plantLocation: {
      type: String,
      default: 'Howrah, West Bengal, India (PIN: 711114)',
    },
    phone: {
      type: String,
      default: '+91 70446 20790',
    },
    email: {
      type: String,
      default: 'bokul.rope@gmail.com',
    },
    whatsappNumber: {
      type: String,
      default: '917044620790',
    },
    operatingHours: {
      type: String,
      default: 'Mon - Sat: 8:00 AM - 6:00 PM IST',
    },
    metaTitle: {
      type: String,
      default: 'Bokul Rope Works | Industrial Jute Rope & Cordage Mill Howrah',
    },
    metaDescription: {
      type: String,
      default: 'Premier natural fibre cordage mill based in Howrah, West Bengal. Certified manufacturing of 3-strand jute rope, 4-ply cordage, manila rope, and packaging twines.',
    },
    quoteNotificationEmail: {
      type: String,
      default: 'bokul.rope@gmail.com',
    },
    stats: {
      annualCapacity: { type: String, default: '5,000+ Metric Tons' },
      plantArea: { type: String, default: '45,000+ Sq. Ft.' },
      experienceYears: { type: String, default: '35+ Years Industry Legacy' },
      exportCountries: { type: String, default: '14+ Export Countries' },
    },
    socialLinks: {
      linkedin: { type: String, default: '' },
      facebook: { type: String, default: '' },
      indiamart: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

const WebsiteSettings = mongoose.models.WebsiteSettings || mongoose.model('WebsiteSettings', websiteSettingsSchema);
export default WebsiteSettings;
