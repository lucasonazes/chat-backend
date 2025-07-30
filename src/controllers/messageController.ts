import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/prisma';
import { Server } from 'socket.io';

export const createMessage = async (req: AuthRequest, res: Response) => {
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
};

export const getConversation = async (req: AuthRequest, res: Response) => {
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
};

export const createMessageSocket = async (io: Server, senderId: string, receiverId: string, content: string) => {
  if (!senderId || !receiverId || !content) return;

  const message = await prisma.message.create({
    data: { content, senderId, receiverId }
  });

  io.to(receiverId).emit('receiveMessage', message);
  io.to(senderId).emit('receiveMessage', message);

  return message;
};
