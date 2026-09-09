import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: { userId: string; companyId: string; role: string; isSuperAdmin: boolean };
  params: Record<string, string>;
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);
    req.user = {
      userId: payload.userId,
      companyId: payload.companyId,
      role: payload.role,
      isSuperAdmin: payload.isSuperAdmin ?? false,
    };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
