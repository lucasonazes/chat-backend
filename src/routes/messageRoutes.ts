import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { getConversation } from '../controllers/messageController';

const messageRoutes = Router();

messageRoutes.get('/:user1/:user2', authenticateToken, getConversation);

export default messageRoutes;
