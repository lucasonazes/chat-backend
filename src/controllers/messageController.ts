import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/prisma';
import { Server } from 'socket.io';

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
