import { Server, Socket } from 'socket.io';
import { AuthenticatedSocket } from '../types/socket';
import prisma from '../config/prisma';
import fs from 'fs';
import path from 'path';
import { sendMessageSchema } from '../schemas/messageSchemas';
import { ApiError } from '../middleware/errorHandler';

export default function handleSocketEvents(io: Server, socket: Socket) {
  socket.on('join', (userId: string) => {
    socket.join(userId);
  });

  socket.on('sendMessage', async (payload) => {
    try {
      const parsed = sendMessageSchema.parse(payload);

      const { content, file, fileName, fileType, receiverId } = parsed;
      const senderId = (socket as AuthenticatedSocket).userId;

      if (!senderId) {
        const err = new ApiError(401, 'UNAUTHORIZED', 'User not authenticated');
        socket.emit('errorMessage', { success: false, code: err.code, message: err.message });
        return;
      }

      let fileUrl: string | null = null;
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
    } catch (err) {
      console.error('Error in sendMessage:', err);
      socket.emit('errorMessage', {
        success: false,
        code: 'INTERNAL_ERROR',
        message: 'Internal server error'
      });
    }
  });

  socket.on('disconnect', () => {});
}
