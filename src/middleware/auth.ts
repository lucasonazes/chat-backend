import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/token';
import { ApiError } from './errorHandler';

export interface AuthRequest extends Request {
  user?: { userId: string; email: string };
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) throw new ApiError(401, 'UNAUTHORIZED', 'No token provided');

    const decoded = verifyToken(token) as {
      userId: string;
      email: string;
    };

    req.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
}
