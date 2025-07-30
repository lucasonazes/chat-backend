import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { getMe, getUserById, getUsers } from '../controllers/userController';

const userRoutes = Router();

userRoutes.get('/', authenticateToken, getUsers);
userRoutes.get('/me', authenticateToken, getMe);
userRoutes.get('/:userId', authenticateToken, getUserById);

export default userRoutes;
