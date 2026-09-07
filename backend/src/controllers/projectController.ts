import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getProjects = async (req: Request, res: Response) => {
  try {
    const { companyId } = req.query;
    const projects = await prisma.project.findMany({
      where: { companyId: String(companyId), isArchived: false },
      include: { team: { select: { name: true } }, manager: { select: { firstName: true, lastName: true } } }
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching projects' });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const { companyId, name, description, clientName, managerId, teamId, status, priority, startDate, endDate } = req.body;
    const project = await prisma.project.create({
      data: {
        companyId, name, description, clientName, managerId, teamId, status, priority,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null
      }
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Server error creating project' });
  }
};
