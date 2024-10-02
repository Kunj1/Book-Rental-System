import { Request, Response, NextFunction } from 'express';
import Transaction, { ITransaction } from '../models/Transaction';
import Book from '../models/Book';
import User from '../models/User';
import logger from '../utils/logger';

export const issueBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info(`Issuing book: ${JSON.stringify(req.body)}`);
    const { bookId, userId, issueDate } = req.body;

    const book = await Book.findById(bookId);
    const user = await User.findById(userId);

    if (!book || !user) {
      logger.warn(`Book or User not found: bookId=${bookId}, userId=${userId}`);
      return res.status(404).json({ message: 'Book or User not found' });
    }

    const transaction = new Transaction({
      bookId,
      userId,
      issueDate: new Date(issueDate),
    });

    await transaction.save();
    logger.info(`Book issued successfully: transactionId=${transaction._id}`);
    res.status(201).json(transaction);
  } catch (error) {
    logger.error('Error issuing book:', error);
    next(error);
  }
};

export const returnBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info(`Returning book: ${JSON.stringify(req.body)}`);
    const { bookId, userId, returnDate } = req.body;

    const transaction = await Transaction.findOne({ bookId, userId, returnDate: null });

    if (!transaction) {
      logger.warn(`Transaction not found: bookId=${bookId}, userId=${userId}`);
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const book = await Book.findById(bookId);

    if (!book) {
      logger.warn(`Book not found: bookId=${bookId}`);
      return res.status(404).json({ message: 'Book not found' });
    }

    const returnDateObj = new Date(returnDate);
    const issueDateObj = new Date(transaction.issueDate);

    if (isNaN(returnDateObj.getTime()) || isNaN(issueDateObj.getTime())) {
      logger.warn(`Invalid date format: returnDate=${returnDate}, issueDate=${transaction.issueDate}`);
      return res.status(400).json({ message: 'Invalid date format' });
    }

    if (returnDateObj < issueDateObj) {
      logger.warn(`Invalid return date: ${returnDate} is earlier than issue date ${transaction.issueDate}`);
      return res.status(400).json({ message: 'Return date must not be earlier than the issue date' });
    }

    // Calculate the number of days, ensuring it's at least 1
    const daysRented = Math.max(1, Math.ceil((returnDateObj.getTime() - issueDateObj.getTime()) / (1000 * 3600 * 24)));
    const rentAmount = daysRented * book.rentPerDay;

    transaction.returnDate = returnDateObj;
    transaction.rentAmount = rentAmount;

    await transaction.save();
    logger.info(`Book returned successfully: transactionId=${transaction._id}, rentAmount=${rentAmount}, daysRented=${daysRented}`);
    res.json(transaction);
  } catch (error) {
    logger.error('Error returning book:', error);
    next(error);
  }
};

export const getBookTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookId } = req.params;
    logger.info(`Fetching transactions for book: ${bookId}`);
    const transactions = await Transaction.find({ bookId }).populate('userId');
    
    const currentlyIssued = transactions.find(t => !t.returnDate);
    const pastTransactions = transactions.filter(t => t.returnDate);

    logger.info(`Retrieved ${transactions.length} transactions for book ${bookId}`);
    res.json({
      totalCount: transactions.length,
      currentlyIssued: currentlyIssued ? currentlyIssued.userId : null,
      pastTransactions: pastTransactions.map(t => t.userId),
    });
  } catch (error) {
    logger.error(`Error fetching book transactions: ${error}`);
    next(error);
  }
};

export const getBookRentTotal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookId } = req.params;
    logger.info(`Calculating total rent for book: ${bookId}`);
    const transactions = await Transaction.find({ bookId, returnDate: { $ne: null } });
    const totalRent = transactions.reduce((sum, t) => sum + (t.rentAmount || 0), 0);
    logger.info(`Total rent for book ${bookId}: ${totalRent}`);
    res.json({ totalRent });
  } catch (error) {
    logger.error(`Error calculating book rent total: ${error}`);
    next(error);
  }
};

export const getUserTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    logger.info(`Fetching transactions for user: ${userId}`);
    const transactions = await Transaction.find({ userId }).populate('bookId');
    logger.info(`Retrieved ${transactions.length} transactions for user ${userId}`);
    res.json(transactions.map(t => t.bookId));
  } catch (error) {
    logger.error(`Error fetching user transactions: ${error}`);
    next(error);
  }
};

export const getTransactionsByDateRange = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query;
    logger.info(`Fetching transactions for date range: ${startDate} to ${endDate}`);
    const transactions = await Transaction.find({
      issueDate: { $gte: new Date(startDate as string), $lte: new Date(endDate as string) }
    }).populate('bookId userId');
    logger.info(`Retrieved ${transactions.length} transactions for the given date range`);
    res.json(transactions);
  } catch (error) {
    logger.error(`Error fetching transactions by date range: ${error}`);
    next(error);
  }
};

export const getAllTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('Fetching all transactions');
    const transactions = await Transaction.find().populate('bookId userId');
    logger.info(`Retrieved ${transactions.length} transactions`);
    res.json(transactions);
  } catch (error) {
    logger.error(`Error fetching all transactions: ${error}`);
    next(error);
  }
};

export const getBookTransactionDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookId } = req.params;
    logger.info(`Fetching transaction details for book: ${bookId}`);
    const transactions = await Transaction.find({ bookId }).populate('userId');
    
    const pastIssues = transactions.filter(t => t.returnDate);
    const currentIssue = transactions.find(t => !t.returnDate);
    
    logger.info(`Retrieved ${transactions.length} transactions for book ${bookId}`);
    res.json({
      totalIssueCount: transactions.length,
      pastIssuesCount: pastIssues.length,
      currentStatus: currentIssue ? 'Issued' : 'Available',
      currentHolder: currentIssue ? currentIssue.userId : null,
      pastIssues: pastIssues.map(t => ({
        userId: t.userId,
        issueDate: t.issueDate,
        returnDate: t.returnDate
      }))
    });
  } catch (error) {
    logger.error(`Error fetching book transaction details: ${error}`);
    next(error);
  }
};