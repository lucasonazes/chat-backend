import { Router } from 'express';
import prisma from '../config/prisma';
import bcrypt from 'bcrypt';

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

export default userRoutes;
