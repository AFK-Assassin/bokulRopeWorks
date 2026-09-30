import ProcessStep from '../models/ProcessStep.js';
import ActivityLog from '../models/ActivityLog.js';

export const getProcessSteps = async (req, res, next) => {
  try {
    const isPublic = !req.user;
    const filter = isPublic ? { isPublished: true } : {};
    const steps = await ProcessStep.find(filter).sort({ stepNumber: 1, order: 1 });
    res.status(200).json({ success: true, count: steps.length, data: steps });
  } catch (error) {
    next(error);
  }
};

export const createProcessStep = async (req, res, next) => {
  try {
    const { stepNumber, title, description, imageUrl, keyParameters, isPublished, order } = req.body;
    const step = await ProcessStep.create({
      stepNumber: Number(stepNumber) || 1,
      title,
      description,
      imageUrl: imageUrl || '/images/bokul_rope_works_process.webp',
      keyParameters: Array.isArray(keyParameters) ? keyParameters : (keyParameters ? keyParameters.split(',').map(s => s.trim()) : []),
      isPublished: isPublished !== undefined ? isPublished : true,
      order: Number(order) || 0,
    });

    await ActivityLog.create({
      action: `Added Process Step: Step ${step.stepNumber} - ${step.title}`,
      category: 'Process',
      adminEmail: req.user?.email || 'admin@bokulrope.com',
    });

    res.status(201).json({ success: true, data: step });
  } catch (error) {
    next(error);
  }
};

export const updateProcessStep = async (req, res, next) => {
  try {
    const { stepNumber, title, description, imageUrl, keyParameters, isPublished, order } = req.body;
    const updateData = {
      ...(stepNumber !== undefined && { stepNumber: Number(stepNumber) }),
      ...(title && { title }),
      ...(description && { description }),
      ...(imageUrl && { imageUrl }),
      ...(keyParameters && {
        keyParameters: Array.isArray(keyParameters) ? keyParameters : keyParameters.split(',').map(s => s.trim()),
      }),
      ...(isPublished !== undefined && { isPublished }),
      ...(order !== undefined && { order: Number(order) }),
    };

    const step = await ProcessStep.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!step) {
      return res.status(404).json({ success: false, message: 'Process step not found' });
    }

    await ActivityLog.create({
      action: `Updated Process Step: ${step.title}`,
      category: 'Process',
      adminEmail: req.user?.email || 'admin@bokulrope.com',
    });

    res.status(200).json({ success: true, data: step });
  } catch (error) {
    next(error);
  }
};

export const deleteProcessStep = async (req, res, next) => {
  try {
    const step = await ProcessStep.findByIdAndDelete(req.params.id);
    if (!step) {
      return res.status(404).json({ success: false, message: 'Process step not found' });
    }

    await ActivityLog.create({
      action: `Deleted Process Step: ${step.title}`,
      category: 'Process',
      adminEmail: req.user?.email || 'admin@bokulrope.com',
    });

    res.status(200).json({ success: true, message: 'Process step removed successfully' });
  } catch (error) {
    next(error);
  }
};
