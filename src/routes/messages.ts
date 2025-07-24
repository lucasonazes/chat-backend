import { Router } from 'express';
import prisma from '../config/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const messageRoutes = Router();

messageRoutes.post('/', authenticateToken, async (req: AuthRequest, res) => {
  const { content, receiverId } = req.body;
  const senderId = req.user?.userId;

  if (!senderId || !receiverId || !content) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const message = await prisma.message.create({
      data: { content, senderId, receiverId }
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Error creating message', message: error });
  }
});

messageRoutes.get('/:user1/:user2', authenticateToken, async (req, res) => {
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
