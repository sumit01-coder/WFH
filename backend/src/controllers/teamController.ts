import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/requireAuth';

export const getTeams = async (req: AuthRequest, res: Response) => {
  try {
    const { companyId } = req.user!;
    const { departmentId } = req.query;
    const whereClause: any = { companyId: String(companyId), isActive: true };
    if (departmentId) whereClause.departmentId = String(departmentId);

    const teams = await prisma.team.findMany({ 
      where: whereClause,
      include: {
        leader: { select: { firstName: true, lastName: true } },
        department: { select: { name: true } },
        members: { select: { user: { select: { id: true, firstName: true, lastName: true, userRoles: { include: { role: true }, take: 1 } } } } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching teams' });
  }
};

export const createTeam = async (req: AuthRequest, res: Response) => {
  try {
    const { companyId } = req.user!;
    const { name, description, leaderId, members, departmentId: reqDeptId } = req.body;
    
    // If no department is provided, we need to create or find a default "General" department
    let departmentId = reqDeptId;
    if (!departmentId) {
      let defaultDept = await prisma.department.findFirst({ where: { companyId, name: 'General' } });
      if (!defaultDept) {
        defaultDept = await prisma.department.create({ data: { companyId, name: 'General', description: 'General team department' } });
      }
      departmentId = defaultDept.id;
    }

    const team = await prisma.team.create({
      data: { 
        companyId, departmentId, name, description, leaderId,
        members: {
          create: (members || []).map((userId: string) => ({ userId }))
        }
      },
      include: {
        leader: { select: { firstName: true, lastName: true } },
        department: { select: { name: true } },
        members: { select: { user: { select: { id: true, firstName: true, lastName: true, userRoles: { include: { role: true }, take: 1 } } } } }
      }
    });
    res.status(201).json(team);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error creating team' });
  }
};
