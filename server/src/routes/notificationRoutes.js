import express from 'express';
import { listNotifications, markAsRead, markAllAsRead, createNotification } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', listNotifications);
router.post('/', createNotification);
router.patch('/mark-all-read', markAllAsRead);
router.patch('/:id/read', markAsRead);

export default router;
