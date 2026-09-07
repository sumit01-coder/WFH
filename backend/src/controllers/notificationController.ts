import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const { companyId, userId } = req.query;
    const notifications = await prisma.notification.findMany({
      where: { companyId: String(companyId), userId: String(userId) },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching notifications' });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
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

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    await prisma.notification.updateMany({
      where: { userId },
      data: { isRead: true }
    });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Server error updating notifications' });
  }
};
