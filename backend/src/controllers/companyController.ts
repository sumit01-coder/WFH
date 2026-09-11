import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/requireAuth';

export const getCompanyProfile = async (req: AuthRequest, res: Response) => {
  try {
    // Use companyId from JWT — only allow fetching own company (unless SuperAdmin)
    const companyId = req.user!.isSuperAdmin
      ? (req.params['companyId'] as string)
      : req.user!.companyId;
    const company = await prisma.company.findUnique({ where: { id: companyId } });
    if (!company) return res.status(404).json({ error: 'Company not found' });
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching company' });
  }
};

export const updateCompanyProfile = async (req: AuthRequest, res: Response) => {
  try {
    // Always use JWT companyId — prevents IDOR / cross-tenant edits
    const companyId = req.user!.isSuperAdmin
      ? (req.params['companyId'] as string)
      : req.user!.companyId;
    const { name, address, phone, website, email, workingDays, workingHoursStart, workingHoursEnd, breakStart, breakEnd, timezone } = req.body;
    
    const updateData: any = { name, address, phone, website, email, timezone };
    
    if (workingDays) updateData.workingDays = workingDays;
    if (workingHoursStart) updateData.workingHoursStart = new Date(`1970-01-01T${workingHoursStart}:00.000Z`);
    if (workingHoursEnd) updateData.workingHoursEnd = new Date(`1970-01-01T${workingHoursEnd}:00.000Z`);

    // Lunch break — allow clearing by passing empty string
    if (breakStart) {
      updateData.breakStart = new Date(`1970-01-01T${breakStart}:00.000Z`);
    } else if (breakStart === '') {
      updateData.breakStart = null;
    }
    if (breakEnd) {
      updateData.breakEnd = new Date(`1970-01-01T${breakEnd}:00.000Z`);
    } else if (breakEnd === '') {
      updateData.breakEnd = null;
    }
    
    const updated = await prisma.company.update({
      where: { id: companyId },
      data: updateData
    });
    res.json(updated);

  } catch (error) {
    res.status(500).json({ error: 'Server error updating company' });
  }
};

export const uploadCompanyLogo = async (req: AuthRequest, res: Response) => {
  try {
    // Always use JWT companyId — prevents IDOR
    const companyId = req.user!.isSuperAdmin
      ? (req.params['companyId'] as string)
      : req.user!.companyId;
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

    // Assuming the server is running on the same domain and we just store the relative path
    const logoUrl = `/uploads/${req.file.filename}`;

    const updated = await prisma.company.update({
      where: { id: companyId },
      data: { logoUrl }
    });

    res.json({ message: 'Logo uploaded successfully', logoUrl: updated.logoUrl });
  } catch (error) {
    console.error('Logo upload error:', error);
    res.status(500).json({ error: 'Server error uploading logo' });
  }
};

export const getAllCompanies = async (req: Request, res: Response) => {
  try {
    const companies = await prisma.company.findMany({
      include: {
        _count: {
          select: { users: true }
        },
        users: {
          where: {
            userRoles: {
              some: {
                role: {
                  name: 'COMPANY_ADMIN'
                }
              }
            }
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const formattedCompanies = companies.map(company => ({
      id: company.id,
      name: company.name,
      slug: company.slug,
      logoUrl: company.logoUrl,
      subscriptionPlan: company.subscriptionPlan,
      createdAt: company.createdAt,
      employeeCount: company._count.users,
      email: company.email,
      phone: company.phone,
      address: company.address,
      website: company.website,
      isActive: company.isActive,
      timezone: company.timezone,
      workingDays: company.workingDays,
      workingHoursStart: company.workingHoursStart,
      workingHoursEnd: company.workingHoursEnd,
      admin: company.users[0] || null
    }));

    res.json(formattedCompanies);
  } catch (error) {
    console.error('Error fetching all companies:', error);
    res.status(500).json({ error: 'Server error fetching all companies' });
  }
};
