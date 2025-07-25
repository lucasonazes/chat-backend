import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/users';
import messageRoutes from './routes/messages';
import setupSocket from './sockets';

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Real time chat API - Created by Lucas Onazes Fensterseifer');
});

app.use('/users', userRoutes);
app.use('/messages', messageRoutes);

setupSocket(io);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
