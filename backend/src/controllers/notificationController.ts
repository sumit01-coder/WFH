import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/requireAuth';

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, companyId } = req.user!;
    const notifications = await prisma.notification.findMany({
      where: { companyId, userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching notifications' });
  }
};

export const getUnreadCount = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, companyId } = req.user!;
    const count = await prisma.notification.count({
      where: { companyId, userId, isRead: false }
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching unread count' });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params['id'] as string;
    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating notification' });
  }
};

export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, companyId } = req.user!;
    await prisma.notification.updateMany({
      where: { userId, companyId },
      data: { isRead: true }
    });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Server error updating notifications' });
  }
};


