// FILE: server/routes/notificationRoutes.js
import express from 'express';
import { getUnreadCount, getNotifications, markAllRead,clearReadNotifications,deleteReadNotifications } from '../controllers/notificationController.js';
import { requireAuth } from '../utils/authUtils.js';

const router = express.Router();

router.get('/unread-count', requireAuth, getUnreadCount);
router.get('/',             requireAuth, getNotifications);
router.patch('/mark-read',  requireAuth, markAllRead);
router.delete(
  '/clear',
  requireAuth,
  clearReadNotifications
);
router.delete(
  '/clear-read',
  requireAuth,
  deleteReadNotifications
);

export default router;