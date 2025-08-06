import { NextFunction, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/prisma';
import { ApiError } from '../middleware/errorHandler';

export const getUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });

    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });

    if (!user) throw new ApiError(404, 'USER_NOT_FOUND', 'User not found');

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};
