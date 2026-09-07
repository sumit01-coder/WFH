import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getMeetings = async (req: Request, res: Response) => {
  try {
    const { companyId, userId } = req.query;
    const meetings = await prisma.meeting.findMany({
      where: {
        companyId: String(companyId),
        participants: { some: { userId: String(userId) } }
      },
      include: {
        organizer: { select: { firstName: true, lastName: true } },
        participants: { select: { userId: true, rsvp: true } }
      },
      orderBy: { startAt: 'asc' }
    });
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching meetings' });
  }
};

export const createMeeting = async (req: Request, res: Response) => {
  try {
    const { companyId, title, description, organizerId, startAt, endAt, location, participants } = req.body;
    
    const meeting = await prisma.meeting.create({
      data: {
        companyId, title, description, organizerId, location,
        startAt: new Date(startAt),
        endAt: new Date(endAt),
        participants: {
          create: participants.map((userId: string) => ({ userId }))
        }
      }
    });
    res.status(201).json(meeting);
  } catch (error) {
    res.status(500).json({ error: 'Server error creating meeting' });
  }
};
