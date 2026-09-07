import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getDepartments = async (req: Request, res: Response) => {
  try {
    const { companyId } = req.query;
    const departments = await prisma.department.findMany({
      where: { companyId: String(companyId), isActive: true }
    });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching departments' });
  }
};

export const createDepartment = async (req: Request, res: Response) => {
  try {
    const { companyId, name, description, headId } = req.body;
    const department = await prisma.department.create({
      data: { companyId, name, description, headId }
    });
    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ error: 'Server error creating department' });
  }
};
