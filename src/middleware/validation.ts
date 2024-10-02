import { Request, Response, NextFunction } from 'express';

export const validateBookCreation = (req: Request, res: Response, next: NextFunction): void => {
  const { name, category, rentPerDay } = req.body;
  if (!name || !category || !rentPerDay) {
    res.status(400).json({ message: 'Name, category, and rentPerDay are required' });
    return;
  }
  if (typeof rentPerDay !== 'number' || rentPerDay <= 0) {
    res.status(400).json({ message: 'rentPerDay must be a positive number' });
    return;
  }
  next();
};

export const validateTransactionCreation = (req: Request, res: Response, next: NextFunction): void => {
  const { bookId, userId, issueDate } = req.body;
  if (!bookId || !userId || !issueDate) {
    res.status(400).json({ message: 'BookId, userId, and issueDate are required' });
    return;
  }
  if (!Date.parse(issueDate)) {
    res.status(400).json({ message: 'Invalid issueDate format' });
    return;
  }
  next();
};