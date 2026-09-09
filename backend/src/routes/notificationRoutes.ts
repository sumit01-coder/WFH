import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from '../controllers/notificationController';

const router = Router();

router.get('/', requireAuth, getNotifications as any);
router.get('/unread-count', requireAuth, getUnreadCount as any);
router.patch('/:id/read', requireAuth, markAsRead as any);
router.post('/read-all', requireAuth, markAllAsRead as any);

export default router;
