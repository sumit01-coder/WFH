import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/requireAuth';

export const getMeetings = async (req: AuthRequest, res: Response) => {
  try {
    const { companyId, userId } = req.user!;
    const meetings = await prisma.meeting.findMany({
      where: {
        companyId,
        participants: { some: { userId } }
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

export const createMeeting = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, startAt, endAt, location, participants } = req.body;
    const { companyId, userId: organizerId } = req.user!;
    
    // Ensure the organizer is also included in the participants array
    const participantIds = new Set(participants || []);
    participantIds.add(organizerId);

    const meeting = await prisma.meeting.create({
      data: {
        companyId, title, description, organizerId, location,
        startAt: new Date(startAt),
        endAt: new Date(endAt),
        participants: {
          create: Array.from(participantIds).map((uid: any) => ({ userId: uid }))
        }
      },
      include: {
        organizer: { select: { firstName: true, lastName: true } },
        participants: { select: { userId: true, rsvp: true } }
      }
    });
    res.status(201).json(meeting);
  } catch (error) {
    res.status(500).json({ error: 'Server error creating meeting' });
  }
};
