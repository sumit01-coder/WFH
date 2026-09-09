import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import prisma from '../utils/prisma';
import { generateTokens } from '../utils/jwt';

type TxClient = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;

// ─── REGISTER (creates Company + COMPANY_ADMIN user) ─────────────────────────
export const registerCompany = async (req: Request, res: Response) => {
  try {
    const { companyName, firstName, lastName, email, password } = req.body;

    const existingUser = await prisma.user.findFirst({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'Email already in use' });

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await prisma.$transaction(async (tx: TxClient) => {
      const company = await tx.company.create({
        data: {
          name: companyName,
          slug: companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          email,
          workingDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
        },
      });

      const user = await tx.user.create({
        data: { companyId: company.id, firstName, lastName, email, passwordHash },
      });

      // Ensure COMPANY_ADMIN role exists
      let role = await tx.role.findFirst({ where: { name: 'COMPANY_ADMIN' } });
      if (!role) {
        role = await tx.role.create({ data: { name: 'COMPANY_ADMIN', description: 'Company Administrator' } });
      }

      await tx.userRole.create({ data: { userId: user.id, roleId: role.id, companyId: company.id } });

      return { company, user, roleName: role.name };
    });

    const tokens = generateTokens(result.user.id, result.company.id, result.roleName);

    res.status(201).json({
      message: 'Company and admin registered successfully',
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        companyId: result.company.id,
        role: result.roleName,
      },
      company: { id: result.company.id, name: result.company.name },
      tokens,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

// ─── LOGIN (returns role in JWT) ─────────────────────────────────────────────
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findFirst({
      where: { email, isDeleted: false },
      include: { 
        userRoles: { include: { role: true }, take: 1 },
        company: true
      },
    });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isValid = user.passwordHash
      ? await bcrypt.compare(password, user.passwordHash)
      : false;
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

    if (!user.companyId) return res.status(500).json({ error: 'User has no associated company' });

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ error: 'Your account has been suspended. Please contact your company administrator.' });
    }

    const roleName = user.userRoles[0]?.role?.name ?? 'EMPLOYEE';
    const isSuperAdmin = roleName === 'SUPER_ADMIN';

    const tokens = generateTokens(user.id, user.companyId, roleName, isSuperAdmin);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: await bcrypt.hash(tokens.refreshToken, 10),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        companyId: user.companyId,
        companyName: user.company?.name,
        logoUrl: user.company?.logoUrl,
        role: roleName,
        isSuperAdmin,
      },
      tokens,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during login' });
  }
};
