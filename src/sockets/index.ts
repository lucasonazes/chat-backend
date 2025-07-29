import { Server, Socket } from 'socket.io';
import handleSocketEvents from '../controllers/socketController';

export default function setupSocket(io: Server) {
  io.on('connection', (socket: Socket) => {
    handleSocketEvents(io, socket);
  });
}
