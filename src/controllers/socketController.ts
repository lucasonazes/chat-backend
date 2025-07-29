import { Server, Socket } from 'socket.io';
import prisma from '../config/prisma';

export default function handleSocketEvents(io: Server, socket: Socket) {
  socket.on('join', (userId: string) => {
    socket.join(userId);
  });

  socket.on('sendMessage', async ({ content, senderId, receiverId }) => {
    const message = await prisma.message.create({
      data: { content, senderId, receiverId }
    });

    io.to(receiverId).emit('receiveMessage', message);
    io.to(senderId).emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {});
}
