import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/token';
import { loginSchema, registerSchema } from '../schemas/authSchemas';
import { ApiError } from '../middleware/errorHandler';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = registerSchema.parse(req.body);

    const { name, email, password } = parsed;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new ApiError(400, 'USER_EXISTS', 'User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });

    const token = generateToken({ userId: user.id, email: user.email });

    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = loginSchema.parse(req.body);

    const { email, password } = parsed;
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) throw new ApiError(400, 'USER_NOT_FOUND', 'User not found');

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) throw new ApiError(400, 'INVALID_CREDENTIALS', 'Incorrect Password');

    const token = generateToken({ userId: user.id, email: user.email });

    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};
