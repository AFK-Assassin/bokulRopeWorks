import Certification from '../models/Certification.js';
import ActivityLog from '../models/ActivityLog.js';

export const getCertifications = async (req, res, next) => {
  try {
    const isPublic = !req.user;
    const filter = isPublic ? { isPublished: true } : {};
    const certs = await Certification.find(filter).sort({ order: 1, createdAt: 1 });
    res.status(200).json({ success: true, count: certs.length, data: certs });
  } catch (error) {
    next(error);
  }
};

export const createCertification = async (req, res, next) => {
  try {
    const { title, issuingAuthority, certificateNumber, description, standardCode, validUntil, documentUrl, imageUrl, isPublished, order } = req.body;
    const cert = await Certification.create({
      title,
      issuingAuthority,
      certificateNumber,
      description,
      standardCode: standardCode || 'IS 5175 / ISO 9001',
      validUntil,
      documentUrl,
      imageUrl,
      isPublished: isPublished !== undefined ? isPublished : true,
      order: Number(order) || 0,
    });

    await ActivityLog.create({
      action: `Added Certification: ${title}`,
      category: 'Certification',
      adminEmail: req.user?.email || 'admin@bokulrope.com',
    });

    res.status(201).json({ success: true, data: cert });
  } catch (error) {
    next(error);
  }
};

export const updateCertification = async (req, res, next) => {
  try {
    const { title, issuingAuthority, certificateNumber, description, standardCode, validUntil, documentUrl, imageUrl, isPublished, order } = req.body;
    const updateData = {
      ...(title && { title }),
      ...(issuingAuthority && { issuingAuthority }),
      ...(certificateNumber !== undefined && { certificateNumber }),
      ...(description !== undefined && { description }),
      ...(standardCode && { standardCode }),
      ...(validUntil !== undefined && { validUntil }),
      ...(documentUrl !== undefined && { documentUrl }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(isPublished !== undefined && { isPublished }),
      ...(order !== undefined && { order: Number(order) }),
    };

    const cert = await Certification.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!cert) {
      return res.status(404).json({ success: false, message: 'Certification record not found' });
    }

    await ActivityLog.create({
      action: `Updated Certification: ${cert.title}`,
      category: 'Certification',
      adminEmail: req.user?.email || 'admin@bokulrope.com',
    });

    res.status(200).json({ success: true, data: cert });
  } catch (error) {
    next(error);
  }
};

export const deleteCertification = async (req, res, next) => {
  try {
    const cert = await Certification.findByIdAndDelete(req.params.id);
    if (!cert) {
      return res.status(404).json({ success: false, message: 'Certification not found' });
    }

    await ActivityLog.create({
      action: `Deleted Certification: ${cert.title}`,
      category: 'Certification',
      adminEmail: req.user?.email || 'admin@bokulrope.com',
    });

    res.status(200).json({ success: true, message: 'Certification removed successfully' });
  } catch (error) {
    next(error);
  }
};
