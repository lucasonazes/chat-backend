import { Router } from 'express';
import prisma from '../config/prisma';

const messageRoutes = Router();

messageRoutes.post('/', async (req, res) => {
  const { content, senderId, receiverId } = req.body;

  try {
    const message = await prisma.message.create({
      data: { content, senderId, receiverId }
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Error creating message', message: error });
  }
});

messageRoutes.get('/:user1/:user2', async (req, res) => {
  const { user1, user2 } = req.params;

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: user1, receiverId: user2 },
          { senderId: user2, receiverId: user1 }
        ]
      },
      orderBy: { createdAt: 'asc' }
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages', message: error });
  }
});

export default messageRoutes;
