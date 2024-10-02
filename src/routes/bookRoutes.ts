import express from 'express';
import { getAllBooks, searchBooks, createBook } from '../controllers/bookController';
import { validateBookCreation } from '../middleware/validation';

const router = express.Router();

router.get('/', getAllBooks);
router.get('/search', searchBooks);
router.post('/', validateBookCreation, createBook);

export default router;