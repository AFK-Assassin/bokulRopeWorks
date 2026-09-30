import ContactMessage from '../models/ContactMessage.js';
import ActivityLog from '../models/ActivityLog.js';

export const getMessages = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let query = {};
    if (status === 'unread') query.isRead = false;
    if (status === 'read') query.isRead = true;
    if (status === 'archived') query.isArchived = true;
    else query.isArchived = false;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    const messages = await ContactMessage.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    next(error);
  }
};

export const createMessage = async (req, res, next) => {
  try {
    const { name, company, email, phone, subject, message } = req.body;
    if (!name || !phone || !message) {
      return res.status(400).json({ success: false, message: 'Please provide name, phone and message' });
    }

    const msg = await ContactMessage.create({
      name,
      company: company || '',
      email: email || '',
      phone,
      subject: subject || 'General Inquiry',
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Message delivered to Bokul Rope Works sales desk',
      data: msg,
    });
  } catch (error) {
    next(error);
  }
};

export const markMessageRead = async (req, res, next) => {
  try {
    const { isRead } = req.body;
    const msg = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { isRead: isRead !== undefined ? isRead : true },
      { new: true }
    );
    if (!msg) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.status(200).json({ success: true, data: msg });
  } catch (error) {
    next(error);
  }
};

export const archiveMessage = async (req, res, next) => {
  try {
    const { isArchived } = req.body;
    const msg = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { isArchived: isArchived !== undefined ? isArchived : true },
      { new: true }
    );
    if (!msg) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.status(200).json({ success: true, data: msg });
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    const msg = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!msg) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    await ActivityLog.create({
      action: `Deleted Contact Message from: ${msg.name}`,
      category: 'Message',
      adminEmail: req.user?.email || 'admin@bokulrope.com',
    });

    res.status(200).json({ success: true, message: 'Message removed successfully' });
  } catch (error) {
    next(error);
  }
};
