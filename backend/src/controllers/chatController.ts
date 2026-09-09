import { Response } from 'express';
import { AuthRequest } from '../middleware/requireAuth';
import prisma from '../utils/prisma';
import { getIO } from '../socket';

export const getRooms = async (req: AuthRequest, res: Response) => {
  try {
    const { companyId, userId, role } = req.user!;
    
    let whereClause: any = { 
      members: { some: { userId } }
    };

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

export const createRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { name, members = [] } = req.body;
    const { companyId, userId } = req.user!;

    if (!name) return res.status(400).json({ error: 'Room name is required' });

    // ensure creator is in the members list
    const roomMembers = members.includes(userId) ? members : [...members, userId];

    const room = await prisma.chatRoom.create({
      data: {
        companyId,
        type: 'TEAM',
        name,
        createdById: userId,
        members: {
          create: roomMembers.map((id: string) => ({ userId: id }))
        }
      },
      include: {
        members: { include: { user: { select: { firstName: true, lastName: true } } } }
      }
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ error: 'Server error creating room' });
  }
};

export const getOrCreateDirectRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { targetUserId } = req.body;
    const { companyId, userId } = req.user!;

    if (!targetUserId) {
      return res.status(400).json({ error: 'targetUserId is required' });
    }

    // Check if a DIRECT room already exists between these exact two users
    const existingRooms = await prisma.chatRoom.findMany({
      where: {
        type: 'DIRECT',
        AND: [
          { members: { some: { userId: userId } } },
          { members: { some: { userId: targetUserId } } }
        ]
      },
      include: {
        members: {
          include: { user: { select: { firstName: true, lastName: true } } }
        }
      }
    });

    // We only want the room if it has EXACTLY these two members
    const room = existingRooms.find(r => r.members.length === 2);

    if (room) {
      return res.json(room);
    }

    // Otherwise, create a new direct room
    const newRoom = await prisma.chatRoom.create({
      data: {
        companyId, // Originates from the creator's company
        type: 'DIRECT',
        createdById: userId,
        members: {
          create: [
            { userId: userId },
            { userId: targetUserId }
          ]
        }
      },
      include: {
        members: {
          include: { user: { select: { firstName: true, lastName: true } } }
        }
      }
    });

    res.status(201).json(newRoom);
  } catch (error) {
    console.error('Error in getOrCreateDirectRoom:', error);
    res.status(500).json({ error: 'Server error creating direct room' });
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

    const isMember = room.members.some((m: any) => m.userId === userId);
    if (!isMember) {
      return res.status(403).json({ error: 'Not a member of this room' });
    }

    const messages = await prisma.chatMessage.findMany({
      where: { roomId },
      include: { 
        sender: { select: { firstName: true, lastName: true } },
        file: true
      },
      orderBy: { createdAt: 'asc' }
    });

    const serializedMessages = messages.map((msg: any) => {
      if (msg.file) {
        return {
          ...msg,
          file: {
            ...msg.file,
            sizeBytes: msg.file.sizeBytes.toString()
          }
        };
      }
      return msg;
    });

    res.json(serializedMessages);
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
    const isMember = room.members.some((m: any) => m.userId === userId);
    if (!isMember) {
      // Auto-add HR/Admin to the room if they send a message
      await prisma.chatMember.create({
        data: { roomId, userId }
      });
    }

    let fileRecord = null;
    let messageType = 'TEXT';
    
    if (req.file) {
      fileRecord = await prisma.file.create({
        data: {
          companyId,
          uploadedById: userId,
          resourceType: 'CHAT_MESSAGE',
          resourceId: roomId, // Using roomId temporarily, will update later if needed, or leave as roomId
          originalName: req.file.originalname,
          storedName: req.file.filename,
          filePath: req.file.path,
          mimeType: req.file.mimetype,
          sizeBytes: BigInt(req.file.size)
        }
      });
      messageType = 'FILE';
    }

    const message = await prisma.chatMessage.create({
      data: { 
        roomId, 
        senderId: userId, 
        content,
        type: messageType,
        fileId: fileRecord ? fileRecord.id : null
      },
      include: { 
        sender: { select: { firstName: true, lastName: true } },
        file: true
      }
    });

    if (fileRecord) {
      // Convert BigInt to string for JSON serialization
      (message as any).file.sizeBytes = fileRecord.sizeBytes.toString();
    }

    // Emit real-time event to all clients in the room
    getIO().to(roomId).emit('new_message', message);

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Server error sending message' });
  }
};
