import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getAssignments = async (req: Request, res: Response) => {
  try {
    const { companyId, assignedToId } = req.query;
    const assignments = await prisma.assignment.findMany({
      where: { companyId: String(companyId), assignedToId: String(assignedToId) },
      orderBy: { createdAt: 'desc' }
    });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching assignments' });
  }
};

export const createAssignment = async (req: Request, res: Response) => {
  try {
    const { companyId, projectId, title, description, instructions, assignedToId, assignedById, dueDate } = req.body;
    const assignment = await prisma.assignment.create({
      data: {
        companyId, projectId, title, description, instructions, assignedToId, assignedById,
        dueDate: dueDate ? new Date(dueDate) : null
      }
    });
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ error: 'Server error creating assignment' });
  }
};
