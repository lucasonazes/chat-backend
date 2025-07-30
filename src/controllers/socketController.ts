import { Server, Socket } from 'socket.io';
import { AuthenticatedSocket } from '../types/socket';
import { createMessageSocket } from './messageController';

export default function handleSocketEvents(io: Server, socket: Socket) {
  socket.on('join', (userId: string) => {
    socket.join(userId);
  });

  socket.on('sendMessage', async ({ content, receiverId }) => {
    const senderId = (socket as AuthenticatedSocket).userId;
    await createMessageSocket(io, senderId, receiverId, content);
  });

  socket.on('disconnect', () => {});
}
