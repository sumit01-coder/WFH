import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getCompanyProfile = async (req: Request, res: Response) => {
  try {
    const companyId = req.params['companyId'] as string; // Assume this comes from auth middleware later
    const company = await prisma.company.findUnique({ where: { id: companyId } });
    if (!company) return res.status(404).json({ error: 'Company not found' });
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching company' });
  }
};

export const updateCompanyProfile = async (req: Request, res: Response) => {
  try {
    const companyId = req.params['companyId'] as string;
    const { name, address, phone, website } = req.body;
    
    const updated = await prisma.company.update({
      where: { id: companyId },
      data: { name, address, phone, website }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating company' });
  }
};
