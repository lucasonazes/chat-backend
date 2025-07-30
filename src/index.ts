import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import messageRoutes from './routes/messageRoutes';
import setupSocket from './sockets';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();
const server = http.createServer(app);

const FRONT_URL = process.env.FRONT_URL || 'http://localhost:3000';
const io = new Server(server, {
  cors: {
    origin: FRONT_URL,
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Real time chat API - Created by Lucas Onazes Fensterseifer');
});

app.use('/', authRoutes);
app.use('/users', userRoutes);
app.use('/messages', messageRoutes);

setupSocket(io);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
