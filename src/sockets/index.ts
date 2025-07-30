import { Server, Socket } from 'socket.io';
import handleSocketEvents from '../controllers/socketController';
import jwt from 'jsonwebtoken';
import { AuthenticatedSocket } from '../types/socket';

export default function setupSocket(io: Server) {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
      (socket as AuthenticatedSocket).userId = decoded.userId;
      next();
    } catch {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: Socket) => {
    handleSocketEvents(io, socket);
  });
}
