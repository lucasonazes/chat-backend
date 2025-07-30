import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/token';

export interface AuthRequest extends Request {
  user?: { userId: string; email: string };
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token not provided' });

  try {
    const decoded = verifyToken(token) as {
      userId: string;
      email: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid Token', message: error });
  }
}
