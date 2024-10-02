import express from 'express';
import { getAllUsers, createUser, searchUsers } from '../controllers/userController';

const router = express.Router();

router.get('/', getAllUsers);
router.post('/', createUser);
router.get('/search', searchUsers);

export default router;