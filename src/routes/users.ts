import { Router } from 'express';
import prisma from '../config/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userRoutes = Router();

userRoutes.post('/', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error creating user', message: error });
  }
});

userRoutes.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users', message: error });
  }
});

userRoutes.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) return res.status(401).json({ error: 'Incorrect Password' });

    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Login error', message: error });
  }
});

export default userRoutes;
