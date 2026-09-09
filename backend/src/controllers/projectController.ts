import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/requireAuth';

export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const { companyId } = req.user!;
    const projects = await prisma.project.findMany({
      where: { companyId, isArchived: false },
      include: { team: { select: { name: true } }, manager: { select: { firstName: true, lastName: true } } }
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching projects' });
  }
};

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, clientName, managerId, teamId, status, priority, startDate, endDate } = req.body;
    const { companyId } = req.user!;
    
    const project = await prisma.project.create({
      data: {
        companyId, name, description, clientName, managerId, teamId, status, priority,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null
      }
    });

    if (managerId && managerId !== req.user!.userId) {
      await prisma.notification.create({
        data: {
          companyId,
          userId: managerId,
          type: 'PROJECT',
          title: 'New Project Assigned',
          body: `You have been assigned as the manager for project: ${name}`,
          resourceType: 'PROJECT',
          resourceId: project.id
        }
      });
    }

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Server error creating project' });
  }
};

export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params['id'] as string;
    const { name, description, clientName, managerId, teamId, status, priority, startDate, endDate } = req.body;
    const { companyId, userId } = req.user!;

    const existingProject = await prisma.project.findUnique({ where: { id, companyId } });
    
    if (!existingProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const updatedProject = await prisma.$transaction(async (tx: any) => {
      const project = await tx.project.update({
        where: { id },
        data: {
          name, description, clientName, managerId, teamId, status, priority,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null
        }
      });

      await tx.auditLog.create({
        data: {
          companyId,
          actorId: userId,
          action: 'UPDATE_PROJECT',
          resourceType: 'PROJECT',
          resourceId: id,
          oldData: existingProject as any,
          newData: project as any
        }
      });

      return project;
    });

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating project' });
  }
};
