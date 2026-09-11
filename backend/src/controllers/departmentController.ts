import { Response } from 'express';
import { AuthRequest } from '../middleware/requireAuth';
import prisma from '../utils/prisma';

export const getDepartments = async (req: AuthRequest, res: Response) => {
  try {
    const { companyId } = req.user!;
    const departments = await prisma.department.findMany({
      where: { companyId, isActive: true }
    });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching departments' });
  }
};

import { canModifyUser } from '../utils/rbac';

export const createDepartment = async (req: AuthRequest, res: Response) => {
  try {
    const { companyId, role: requesterRole } = req.user!;
    const { name, description, headId } = req.body;

    if (headId) {
      const canAssign = await canModifyUser(requesterRole, headId, true);
      if (!canAssign) return res.status(403).json({ error: 'You cannot assign a user of higher role as department head.' });
    }

    const department = await prisma.department.create({
      data: { companyId, name, description, headId }
    });
    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ error: 'Server error creating department' });
  }
};
