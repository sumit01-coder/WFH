import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getTeams = async (req: Request, res: Response) => {
  try {
    const { companyId, departmentId } = req.query;
    const whereClause: any = { companyId: String(companyId), isActive: true };
    if (departmentId) whereClause.departmentId = String(departmentId);

    const teams = await prisma.team.findMany({ where: whereClause });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching teams' });
  }
};

export const createTeam = async (req: Request, res: Response) => {
  try {
    const { companyId, departmentId, name, description, leaderId } = req.body;
    const team = await prisma.team.create({
      data: { companyId, departmentId, name, description, leaderId }
    });
    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ error: 'Server error creating team' });
  }
};
