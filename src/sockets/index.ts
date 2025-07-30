import { Server, Socket } from 'socket.io';
import handleSocketEvents from '../controllers/socketController';
import { AuthenticatedSocket } from '../types/socket';
import { verifyToken } from '../utils/token';

export default function setupSocket(io: Server) {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));

    try {
      const decoded = verifyToken(token) as { userId: string };
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
