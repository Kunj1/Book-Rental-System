import express, { Request, Response, NextFunction } from 'express';
import {
  issueBook,
  returnBook,
  getBookTransactions,
  getBookRentTotal,
  getUserTransactions,
  getTransactionsByDateRange,
  getAllTransactions,
  getBookTransactionDetails
} from '../controllers/transactionController';
import { validateTransactionCreation } from '../middleware/validation';

const router = express.Router();

// Type-safe wrapper for async route handlers
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

router.get('/', asyncHandler(getAllTransactions));
router.post('/issue', validateTransactionCreation, asyncHandler(issueBook));
router.post('/return', asyncHandler(returnBook));
router.get('/book/:bookId', asyncHandler(getBookTransactions));
router.get('/book/:bookId/rent-total', asyncHandler(getBookRentTotal));
router.get('/user/:userId', asyncHandler(getUserTransactions));
router.get('/date-range', asyncHandler(getTransactionsByDateRange));
router.get('/book/:bookId/details', asyncHandler(getBookTransactionDetails));

export default router;