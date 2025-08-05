import { Server, Socket } from 'socket.io';
import { AuthenticatedSocket } from '../types/socket';
import prisma from '../config/prisma';
import fs from 'fs';
import path from 'path';

export default function handleSocketEvents(io: Server, socket: Socket) {
  socket.on('join', (userId: string) => {
    socket.join(userId);
  });

  socket.on('sendMessage', async (payload) => {
    const { content, file, fileName, fileType, receiverId } = payload;
    let fileUrl: string | null = null;
    const senderId = (socket as AuthenticatedSocket).userId;

    if (!senderId || !receiverId) return;

    const uploadDir = path.resolve(__dirname, '../../uploads');

    if (file) {
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      const buffer = Buffer.from(file.split(',')[1], 'base64');
      const fileNameOnDisk = `${Date.now()}-${fileName}`;
      const filePath = path.join(uploadDir, fileNameOnDisk);
      fs.writeFileSync(filePath, buffer);

      const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';
      fileUrl = `${BACKEND_URL}/uploads/${fileNameOnDisk}`;
    }

    const message = await prisma.message.create({
      data: { content: content || null, fileUrl, fileType: fileType || null, senderId, receiverId }
    });

    io.to(receiverId).emit('receiveMessage', message);
    io.to(senderId).emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {});
}
