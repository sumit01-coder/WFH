import { Response } from 'express';
import { AuthRequest } from '../middleware/requireAuth';
import prisma from '../utils/prisma';

export const getAssets = async (req: AuthRequest, res: Response) => {
  try {
    const { companyId } = req.user!;
    
    const assets = await prisma.asset.findMany({
      where: { companyId },
      include: {
        assignedTo: { select: { firstName: true, lastName: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(assets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
};

export const createAsset = async (req: AuthRequest, res: Response) => {
  try {
    const { companyId } = req.user!;
    const { name, category, serialNumber, assignedToId } = req.body;

    if (!name || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const asset = await prisma.asset.create({
      data: {
        companyId,
        name,
        category,
        serialNumber,
        assignedToId: assignedToId || null,
        status: assignedToId ? 'ASSIGNED' : 'AVAILABLE'
      },
      include: {
        assignedTo: { select: { firstName: true, lastName: true } }
      }
    });

    res.status(201).json(asset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create asset' });
  }
};

export const updateAssetStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, assignedToId } = req.body;
    const { companyId } = req.user!;

    const asset = await prisma.asset.update({
      where: { id, companyId },
      data: { 
        status,
        assignedToId: assignedToId !== undefined ? assignedToId : undefined
      },
      include: {
        assignedTo: { select: { firstName: true, lastName: true } }
      }
    });

    res.json(asset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update asset' });
  }
};
