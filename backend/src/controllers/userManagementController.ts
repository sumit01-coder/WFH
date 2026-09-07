import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/requireAuth';

export const inviteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { firstName, lastName, email, role: requestedRole, departmentId, managerId } = req.body;
    const inviterRole = req.user!.role;
    const companyId = req.user!.companyId;

    if (inviterRole === 'EMPLOYEE' || inviterRole === 'MANAGER') {
      return res.status(403).json({ error: 'You do not have permission to invite users.' });
    }

    if (inviterRole === 'HR' && (requestedRole === 'COMPANY_ADMIN' || requestedRole === 'SUPER_ADMIN' || requestedRole === 'HR')) {
      return res.status(403).json({ error: 'HR can only invite Managers and Employees.' });
    }

    const existingUser = await prisma.user.findFirst({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    const roleRecord = await prisma.role.findFirst({ where: { name: requestedRole } });
    if (!roleRecord) {
      return res.status(400).json({ error: 'Invalid role specified.' });
    }

    const tempPassword = `Temp@${Math.floor(1000 + Math.random() * 9000)}`;
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    const newUser = await prisma.user.create({
      data: {
        companyId,
        firstName,
        lastName,
        email,
        passwordHash,
        departmentId: departmentId || null,
        managerId: managerId || null,
        status: 'ACTIVE',
      },
    });

    await prisma.userRole.create({
      data: {
        userId: newUser.id,
        roleId: roleRecord.id,
        companyId,
      },
    });

    res.status(201).json({
      message: 'User invited successfully',
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: requestedRole,
      },
      tempPassword,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while inviting user' });
  }
};

export const listCompanyUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      where: { companyId: req.user!.companyId, isDeleted: false },
      include: {
        department: { select: { name: true } },
        manager: { select: { firstName: true, lastName: true } },
        userRoles: { include: { role: true }, take: 1 },
      },
    });

    const formattedUsers = users.map(u => ({
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      department: u.department?.name,
      managerName: u.manager ? `${u.manager.firstName} ${u.manager.lastName}` : null,
      role: u.userRoles[0]?.role?.name ?? 'EMPLOYEE',
      status: u.status,
    }));

    res.json(formattedUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while fetching users' });
  }
};
