import { Response } from 'express';
import { AuthRequest } from '../middleware/requireAuth';
import prisma from '../utils/prisma';

export const getOffboardingTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { companyId, userId, role } = req.user!;
    
    let whereClause: any = { companyId };
    if (!['HR', 'COMPANY_ADMIN', 'SUPER_ADMIN'].includes(role)) {
      whereClause.userId = userId;
    }

    const tasks = await prisma.offboardingTask.findMany({
      where: whereClause,
      include: {
        user: { select: { firstName: true, lastName: true, email: true } }
      },
      orderBy: { createdAt: 'asc' }
    });

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch offboarding tasks' });
  }
};

export const createOffboardingTask = async (req: AuthRequest, res: Response) => {
  try {
    const { companyId } = req.user!;
    const { employeeId, title, description } = req.body;

    if (!employeeId || !title) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const task = await prisma.offboardingTask.create({
      data: {
        companyId,
        userId: employeeId,
        title,
        description
      },
      include: {
        user: { select: { firstName: true, lastName: true } }
      }
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create offboarding task' });
  }
};

export const updateOffboardingTaskStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { isCompleted } = req.body;
    const { companyId } = req.user!;

    const task = await prisma.offboardingTask.update({
      where: { id, companyId },
      data: { isCompleted }
    });

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update task status' });
  }
};
