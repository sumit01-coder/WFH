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

    // Auto-create chat channel for this team
    const chatMembers = [];
    if (leaderId) chatMembers.push({ userId: leaderId });
    if (members && members.length > 0) {
      members.forEach((uid: string) => {
        if (uid !== leaderId) chatMembers.push({ userId: uid });
      });
    }
    // ensure the creator is in the chat
    if (!chatMembers.some(m => m.userId === req.user!.userId)) {
      chatMembers.push({ userId: req.user!.userId });
    }

    await prisma.chatRoom.create({
      data: {
        companyId,
        type: 'TEAM',
        name: `${name} Chat`,
        teamId: team.id,
        createdById: req.user!.userId,
        members: {
          create: chatMembers
        }
      }
    });

    res.status(201).json(team);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error creating team' });
  }
};

export const updateTeam = async (req: AuthRequest, res: Response) => {
  try {
    const { companyId } = req.user!;
    const teamId = req.params.id;
    const { name, description, leaderId, members, departmentId } = req.body;

    // Verify team belongs to company
    const existingTeam = await prisma.team.findFirst({
      where: { id: teamId, companyId: String(companyId) }
    });
    
    if (!existingTeam) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Prepare update data
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (leaderId !== undefined) updateData.leaderId = leaderId;
    if (departmentId !== undefined) updateData.departmentId = departmentId;

    // Handle member updates (delete existing, create new)
    if (members !== undefined) {
      await prisma.teamMember.deleteMany({ where: { teamId } });
      updateData.members = {
        create: members.map((userId: string) => ({ userId }))
      };
    }

    const updatedTeam = await prisma.team.update({
      where: { id: teamId },
      data: updateData,
      include: {
        leader: { select: { firstName: true, lastName: true } },
        department: { select: { name: true } },
        members: { select: { user: { select: { id: true, firstName: true, lastName: true, userRoles: { include: { role: true }, take: 1 } } } } }
      }
    });

    res.json(updatedTeam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating team' });
  }
};

export const deleteTeam = async (req: AuthRequest, res: Response) => {
  try {
    const { companyId } = req.user!;
    const teamId = req.params.id;

    const existingTeam = await prisma.team.findFirst({
      where: { id: teamId, companyId: String(companyId) }
    });

    if (!existingTeam) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Delete members first to satisfy foreign key constraints if no cascade
    await prisma.teamMember.deleteMany({ where: { teamId } });
    
    await prisma.team.delete({
      where: { id: teamId }
    });

    res.json({ success: true, message: 'Team deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error deleting team' });
  }
};
