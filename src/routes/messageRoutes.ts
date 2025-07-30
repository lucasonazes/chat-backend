import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { createMessage, getConversation } from '../controllers/messageController';

const messageRoutes = Router();

messageRoutes.post('/', authenticateToken, createMessage);
messageRoutes.get('/:user1/:user2', authenticateToken, getConversation);

export default messageRoutes;
