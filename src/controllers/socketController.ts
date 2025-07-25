import { Server, Socket } from 'socket.io';

interface MessagePayload {
  content: string;
  senderId: string;
  receiverId: string;
}

export default function handleSocketEvents(io: Server, socket: Socket) {
  socket.on('join', (userId: string) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on('sendMessage', (data: MessagePayload) => {
    const { content, senderId, receiverId } = data;

    io.to(receiverId).emit('receiveMessage', {
      content,
      senderId,
      receiverId,
      createdAt: new Date().toISOString()
    });
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected', socket.id);
  });
}
