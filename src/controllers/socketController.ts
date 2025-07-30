import { Server, Socket } from 'socket.io';
import prisma from '../config/prisma';
import { AuthenticatedSocket } from '../types/socket';

export default function handleSocketEvents(io: Server, socket: Socket) {
  socket.on('join', (userId: string) => {
    socket.join(userId);
  });

  socket.on('sendMessage', async ({ content, receiverId }) => {
    const senderId = (socket as AuthenticatedSocket).userId;

    const message = await prisma.message.create({
      data: { content, senderId, receiverId }
    });

    io.to(receiverId).emit('receiveMessage', message);
    io.to(senderId).emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {});
}
