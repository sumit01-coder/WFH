import { Response } from 'express';
import { AuthRequest } from '../middleware/requireAuth';
import prisma from '../utils/prisma';

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId, assigneeId } = req.query;
    const { userId, companyId, role } = req.user!;
    
    let whereClause: any = { companyId, isArchived: false };
    
    if (projectId) whereClause.projectId = String(projectId);
    
    if (role === 'EMPLOYEE') {
      whereClause.assigneeId = userId;
    } else if (role === 'MANAGER') {
      const subordinates = await prisma.user.findMany({
        where: { managerId: userId },
        select: { id: true }
      });
      const subIds = subordinates.map((s: { id: string }) => s.id);
      const allowedIds = [userId, ...subIds];
      
      if (assigneeId) {
        if (!allowedIds.includes(String(assigneeId))) {
          return res.status(403).json({ error: 'You can only view tasks of your subordinates.' });
        }
        whereClause.assigneeId = String(assigneeId);
      } else {
        whereClause.assigneeId = { in: allowedIds };
      }
    } else {
      if (assigneeId) whereClause.assigneeId = String(assigneeId);
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: { 
        assignee: { select: { firstName: true, lastName: true, photoUrl: true } },
        project: { select: { name: true } },
        createdBy: { select: { firstName: true, lastName: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching tasks' });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId, title, description, assigneeId, status, priority, dueDate } = req.body;
    const { userId, companyId, role } = req.user!;

    if (role === 'EMPLOYEE') {
      return res.status(403).json({ error: 'Employees cannot create tasks. Tasks must be assigned by a Manager or HR.' });
    }
    
    if (role === 'MANAGER' && assigneeId !== userId) {
      const assignee = await prisma.user.findUnique({ where: { id: assigneeId } });
      if (assignee?.managerId !== userId) {
        return res.status(403).json({ error: 'Managers can only assign tasks to their subordinates.' });
      }
    }

    // HR, COMPANY_ADMIN, SUPER_ADMIN hierarchy check
    if (assigneeId && assigneeId !== userId && ['HR', 'COMPANY_ADMIN'].includes(role)) {
      const roleRanks: Record<string, number> = { 'EMPLOYEE': 1, 'MANAGER': 2, 'HR': 3, 'COMPANY_ADMIN': 4, 'SUPER_ADMIN': 5 };
      
      const assigneeRoles = await prisma.userRole.findMany({
        where: { userId: assigneeId },
        include: { role: true }
      });
      
      const assigneeMaxRank = Math.max(...assigneeRoles.map((ur: any) => roleRanks[ur.role.name] || 0));
      const myRank = roleRanks[role] || 0;
      
      if (assigneeMaxRank > myRank) {
        return res.status(403).json({ error: 'You cannot assign tasks to users with a higher role than yours.' });
      }
    }

    const task = await prisma.task.create({
      data: {
        companyId, 
        projectId: projectId || null, 
        title, 
        description, 
        assigneeId, 
        createdById: userId, 
        status, 
        priority,
        dueDate: dueDate ? new Date(dueDate) : null
      },
      include: { assignee: { select: { firstName: true, lastName: true } } }
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Server error creating task' });
  }
};

export const updateTaskStatus = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params['id'] as string;
    const { status } = req.body;
    const { userId, role } = req.user!;

    const task = await prisma.task.findUnique({ where: { id }, include: { assignee: true } });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    if (role === 'EMPLOYEE' && task.assigneeId !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this task.' });
    }
    if (role === 'MANAGER' && task.assigneeId !== userId && task.assignee?.managerId !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this task.' });
    }
    // HR/ADMIN can update any task in their company (the whereClause from finding it inherently restricts them to the company by context, but we should enforce companyId check here)
    if (task.companyId !== req.user!.companyId) {
      return res.status(403).json({ error: 'Not authorized to update this task.' });
    }

    const updated = await prisma.task.update({
      where: { id },
      data: { status }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating task status' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params['id'] as string;
    const { title, description, assigneeId, status, priority, dueDate } = req.body;
    const { userId, role, companyId } = req.user!;

    if (role === 'EMPLOYEE') {
      return res.status(403).json({ error: 'Employees cannot edit task details, only status.' });
    }

    const task = await prisma.task.findUnique({ where: { id }, include: { assignee: true } });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    if (task.companyId !== companyId) {
      return res.status(403).json({ error: 'Not authorized to update this task.' });
    }

    const updated = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        assigneeId,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null
      }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating task' });
  }
};
