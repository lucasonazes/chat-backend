import { Request, Response } from 'express';
import prisma from '../config/prisma';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/token';

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Incorrect Data' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });

    const token = generateToken({ userId: user.id, email: user.email });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user', message: error });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) return res.status(400).json({ error: 'Incorrect Password' });

    const token = generateToken({ userId: user.id, email: user.email });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Login error', message: error });
  }
};
