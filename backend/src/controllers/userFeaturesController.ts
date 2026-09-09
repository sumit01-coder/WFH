import { Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { AuthRequest } from '../middleware/requireAuth'

const prisma = new PrismaClient()

/**
 * GET /api/users/me/features
 * Returns which sidebar features are active for the current employee
 * based on what HR/Manager has assigned/created for them.
 */
export const getMyFeatures = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId
    const companyId = req.user!.companyId
    const role = req.user!.role

    // HR, Managers, Admins see everything — no need to check
    if (['HR', 'MANAGER', 'COMPANY_ADMIN', 'SUPER_ADMIN'].includes(role)) {
      return res.json({
        hasPayroll: true,
        hasExpenses: true,
        hasOnboarding: true,
        hasOffboarding: true,
        hasAssets: true,
      })
    }

    // For employees: check if records exist for them
    const [payroll, expenses, onboarding, offboarding, assets] = await Promise.all([
      // Has any payroll record been created for this employee?
      prisma.payroll.findFirst({ where: { userId, companyId } }),
      // Has any expense ever been submitted by this employee?
      prisma.expense.findFirst({ where: { userId, companyId } }),
      // Has HR assigned onboarding tasks?
      prisma.onboardingTask.findFirst({ where: { userId, companyId } }),
      // Has HR assigned offboarding tasks?
      prisma.offboardingTask.findFirst({ where: { userId, companyId } }),
      // Has any asset been assigned to this employee?
      prisma.asset.findFirst({ where: { assignedToId: userId, companyId } }),
    ])

    res.json({
      hasPayroll: !!payroll,
      hasExpenses: true, // Employees can always submit expenses
      hasOnboarding: !!onboarding,
      hasOffboarding: !!offboarding,
      hasAssets: !!assets,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch user features' })
  }
}
