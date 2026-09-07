import { Response } from 'express';
import { AuthRequest } from '../middleware/requireAuth';
import prisma from '../utils/prisma';

export const getRooms = async (req: AuthRequest, res: Response) => {
  try {
    const { companyId, userId, role } = req.user!;
    
    let whereClause: any = { companyId };
    
    // HR, COMPANY_ADMIN, SUPER_ADMIN can see all rooms in the company
    if (role === 'EMPLOYEE' || role === 'MANAGER') {
      whereClause.members = { some: { userId } };
    }

    const rooms = await prisma.chatRoom.findMany({
      where: whereClause,
      include: {
        members: { include: { user: { select: { firstName: true, lastName: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching chat rooms' });
  }
};

export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const roomId = req.params['roomId'] as string;
    const { userId, role, companyId } = req.user!;

    const room = await prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: { members: true }
    });

    if (!room || room.companyId !== companyId) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (role === 'EMPLOYEE' || role === 'MANAGER') {
      const isMember = room.members.some(m => m.userId === userId);
      if (!isMember) {
        return res.status(403).json({ error: 'Not authorized to view messages in this room' });
      }
    }

    const messages = await prisma.chatMessage.findMany({
      where: { roomId },
      include: { sender: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: 'asc' }
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching messages' });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const roomId = req.params['roomId'] as string;
    const { content } = req.body;
    const { userId, companyId } = req.user!;

    const room = await prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: { members: true }
    });

    if (!room || room.companyId !== companyId) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Ensure sender is a member (even HR must be a member or we auto-add them here? Let's just enforce they must join or be a member to send)
    // Actually, if HR is assigning work, they might just send a message. Let's let anyone who can view it, send a message.
    const isMember = room.members.some(m => m.userId === userId);
    if (!isMember) {
      // Auto-add HR/Admin to the room if they send a message
      await prisma.chatMember.create({
        data: { roomId, userId }
      });
    }

    const message = await prisma.chatMessage.create({
      data: { roomId, senderId: userId, content },
      include: { sender: { select: { firstName: true, lastName: true } } }
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Server error sending message' });
  }
};
