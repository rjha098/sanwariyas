// FILE: server/controllers/notificationController.js
import Notification from '../models/Notification.js';

export const getUnreadCount = async (req, res) => {
  try {
    const { role, id } = req.authUser;
    let query;

    if (role === 'admin' || role === 'staff') {  
      query = { isGlobalAdmin: true, isRead: false };
    } else {
      query = { recipientId: id, isRead: false };
    }

    const count = await Notification.countDocuments(query);
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const { role, id } = req.authUser;
    let query;

    if (role === 'admin' || role === 'staff') {
      query = { isGlobalAdmin: true };
    } else {
      query = { recipientId: id };
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAllRead = async (req, res) => {
  try {
    const { role, id } = req.authUser;
    let query;

    if (role === 'admin' || role === 'staff') {
      query = { isGlobalAdmin: true, isRead: false };
    } else {
      query = { recipientId: id, isRead: false };
    }

    await Notification.updateMany(query, { isRead: true });
    res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const clearReadNotifications = async (req, res) => {
  try {
    const { role, id } = req.authUser;

    let query;

    if (role === 'admin' || role === 'staff') {
      query = {
        isGlobalAdmin: true,
        isRead: true,
      };
    } else {
      query = {
        recipientId: id,
        isRead: true,
      };
    }

    await Notification.deleteMany(query);

    res.json({
      success: true,
      message: 'Notifications cleared',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
 

export const deleteReadNotifications = async (req, res) => {
  try {

      console.log("DELETE CALLED");

    const { role, id } = req.authUser;

      console.log(role);
    console.log(id);
    
    let query;

    if (role === 'admin' || role === 'staff') {
      query = {
        isGlobalAdmin: true,
        isRead: true
      };
    } else {
      query = {
        recipientId: id,
        isRead: true
      };
    }

    await Notification.deleteMany(query);

    res.json({
      success: true,
      message: 'Notifications deleted'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};   