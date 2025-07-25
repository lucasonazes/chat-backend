import { Server, Socket } from 'socket.io';
import handleSocketEvents from '../controllers/socketController';

export default function setupSocket(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log('Socket connected', socket.id);
    handleSocketEvents(io, socket);
  });
}
