import { Response } from 'express';
import { AuthRequest } from '../middleware/requireAuth';
import prisma from '../utils/prisma';
import { canModifyUser } from '../utils/rbac';
import { getIO } from '../socket';

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
    const { projectId, title, description, assigneeId, teamId, status, priority, dueDate } = req.body;
    const { userId, companyId, role } = req.user!;

    if (role === 'EMPLOYEE') {
      return res.status(403).json({ error: 'Employees cannot create tasks. Tasks must be assigned by a Manager or HR.' });
    }

    let targetAssignees: string[] = [];

    if (teamId) {
      // Fetch all employees in this team
      const teamMembers = await prisma.user.findMany({
        where: { teamId, companyId }
      });
      targetAssignees = teamMembers.map((u: any) => u.id);
    } else if (assigneeId) {
      targetAssignees = [assigneeId];
    } else {
      // Unassigned
      targetAssignees = [null as any];
    }

    const createdTasks = [];

    for (const targetId of targetAssignees) {
      if (role === 'MANAGER' && targetId && targetId !== userId) {
        const assignee = await prisma.user.findUnique({ where: { id: targetId } });
        if (assignee?.managerId !== userId) {
          // Skip users that the manager doesn't manage
          continue;
        }
      }

      // RBAC hierarchy check
      if (targetId && targetId !== userId) {
        const canAssign = await canModifyUser(role, targetId, true);
        if (!canAssign) {
          continue; // Skip users with a higher role
        }
      }

      const task = await prisma.task.create({
        data: {
          companyId, 
          projectId: projectId || null, 
          title, 
          description, 
          assigneeId: targetId || null, 
          createdById: userId, 
          status, 
          priority,
          dueDate: dueDate ? new Date(dueDate) : null
        },
        include: { assignee: { select: { firstName: true, lastName: true } } }
      });

      if (targetId && targetId !== userId) {
        const notification = await prisma.notification.create({
          data: {
            companyId,
            userId: targetId,
            type: 'TASK',
            title: 'New Task Assigned',
            body: `You have been assigned to task: ${title}`,
            resourceType: 'TASK',
            resourceId: task.id
          }
        });
        try {
          console.log(`Emitting new_notification to user_${targetId}`);
          getIO().to(`user_${targetId}`).emit('new_notification', notification);
        } catch (err) {
          console.error('Failed to emit realtime notification:', err);
        }
      }

      createdTasks.push(task);
    }

    if (createdTasks.length === 0) {
      return res.status(400).json({ error: 'No valid assignees found or permission denied for selected assignees.' });
    }

    // If only one task created, return the single task to maintain API compatibility
    if (!teamId && createdTasks.length === 1) {
      return res.status(201).json(createdTasks[0]);
    }

    res.status(201).json(createdTasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error creating task' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const taskId = req.params['id'] as string;
    const { userId, role } = req.user!;

    const task = await prisma.task.findUnique({
      where: { id: taskId }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (['EMPLOYEE', 'SUPER_ADMIN', 'COMPANY_ADMIN'].includes(role)) {
      return res.status(403).json({ error: 'You do not have permission to delete tasks.' });
    }

    if (role === 'MANAGER') {
      if (task.createdById !== userId) {
        return res.status(403).json({ error: 'Managers can only delete tasks they created themselves.' });
      }
    }

    // HR can delete any task

    await prisma.task.delete({
      where: { id: taskId }
    });

    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error deleting task' });
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
