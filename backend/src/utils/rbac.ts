import prisma from './prisma';

export const ROLE_RANKS: Record<string, number> = {
  'SUPER_ADMIN': 5,
  'COMPANY_ADMIN': 4,
  'HR': 3,
  'MANAGER': 2,
  'EMPLOYEE': 1,
};

export const getRoleRank = (roleName: string): number => {
  return ROLE_RANKS[roleName] || 0;
};

/**
 * Gets the highest rank of a given user based on their UserRoles.
 * @param userId The ID of the user to check
 * @returns The highest numeric rank of the user's roles
 */
export const getUserMaxRank = async (userId: string): Promise<number> => {
  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    include: { role: true },
  });
  
  if (!userRoles || userRoles.length === 0) return 0;
  
  return Math.max(...userRoles.map((ur) => getRoleRank(ur.role.name)));
};

/**
 * Checks if the requester has permission to modify/assign the target user based on strict vertical hierarchy.
 * @param requesterRole The role name of the user performing the action (e.g., 'HR', 'COMPANY_ADMIN')
 * @param targetUserId The ID of the user being acted upon
 * @param allowEqual If true, users of equal rank can modify each other (default: false)
 * @returns true if permitted, false if the target user has an equal or higher rank
 */
export const canModifyUser = async (
  requesterRole: string, 
  targetUserId: string,
  allowEqual: boolean = false
): Promise<boolean> => {
  const requesterRank = getRoleRank(requesterRole);
  const targetRank = await getUserMaxRank(targetUserId);
  
  return allowEqual ? requesterRank >= targetRank : requesterRank > targetRank;
};
