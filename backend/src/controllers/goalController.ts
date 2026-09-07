import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getGoals = async (req: Request, res: Response) => {
  try {
    const { companyId, assignedToId } = req.query;
    const goals = await prisma.goal.findMany({
      where: { companyId: String(companyId), assignedToId: String(assignedToId) },
      orderBy: { endDate: 'asc' }
    });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching goals' });
  }
};

export const updateGoalProgress = async (req: Request, res: Response) => {
  try {
    const id = req.params['id'] as string;
    const { currentValue } = req.body;
    
    const updated = await prisma.goal.update({
      where: { id },
      data: { currentValue: Number(currentValue) }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating goal progress' });
  }
};
