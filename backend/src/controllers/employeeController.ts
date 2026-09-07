import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import bcrypt from 'bcrypt';

export const getEmployees = async (req: Request, res: Response) => {
  try {
    const { companyId } = req.query; // in real app, get from auth token
    const employees = await prisma.user.findMany({
      where: { companyId: String(companyId), isDeleted: false },
      select: { id: true, firstName: true, lastName: true, email: true, designation: true, status: true, departmentId: true }
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching employees' });
  }
};

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const { companyId, firstName, lastName, email, password, designation, departmentId } = req.body;
    
    const existing = await prisma.user.findFirst({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const passwordHash = await bcrypt.hash(password, 10);

    const employee = await prisma.user.create({
      data: {
        companyId,
        firstName,
        lastName,
        email,
        passwordHash,
        designation,
        departmentId
      },
      select: { id: true, firstName: true, email: true }
    });

    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ error: 'Server error creating employee' });
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const id = req.params['id'] as string;
    await prisma.user.update({
      where: { id },
      data: { isDeleted: true, status: 'INACTIVE' }
    });
    res.json({ message: 'Employee deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error deleting employee' });
  }
};
