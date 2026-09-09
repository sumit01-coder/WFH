import { Response } from 'express';
import { AuthRequest } from '../middleware/requireAuth';
import prisma from '../utils/prisma';

export const getTimesheets = async (req: AuthRequest, res: Response) => {
  try {
    const { companyId, userId, role } = req.user!;
    
    let whereClause: any = { companyId };
    if (!['HR', 'MANAGER', 'COMPANY_ADMIN', 'SUPER_ADMIN'].includes(role)) {
      whereClause.userId = userId;
    }

    const timesheets = await prisma.timesheetEntry.findMany({
      where: whereClause,
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        project: { select: { name: true } },
        task: { select: { title: true } }
      },
      orderBy: { date: 'desc' }
    });

    res.json(timesheets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch timesheets' });
  }
};

export const createTimesheetEntry = async (req: AuthRequest, res: Response) => {
  try {
    const { companyId, userId } = req.user!;
    const { projectId, taskId, date, hours, description } = req.body;

    if (!projectId || !date || !hours) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const entry = await prisma.timesheetEntry.create({
      data: {
        companyId,
        userId,
        projectId,
        taskId: taskId || null,
        date: new Date(date),
        hours: Number(hours),
        description
      },
      include: {
        user: { select: { firstName: true, lastName: true } },
        project: { select: { name: true } },
        task: { select: { title: true } }
      }
    });

    res.status(201).json(entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create timesheet entry' });
  }
};
