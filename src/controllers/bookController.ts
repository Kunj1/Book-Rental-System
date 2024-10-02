import { Request, Response, NextFunction } from 'express';
import Book, { IBook } from '../models/Book';
import logger from '../utils/logger';

export const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('Fetching all books');
    const books: IBook[] = await Book.find();
    logger.info(`Retrieved ${books.length} books`);
    res.json(books);
  } catch (error) {
    logger.error('Error fetching books:', error);
    next(error);
  }
};

export const searchBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info(`Searching books with query: ${JSON.stringify(req.query)}`);
    const { name, category, minRent, maxRent } = req.query;
    let query: any = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    if (minRent || maxRent) {
      query.rentPerDay = {};
      if (minRent) query.rentPerDay.$gte = Number(minRent);
      if (maxRent) query.rentPerDay.$lte = Number(maxRent);
    }

    const books: IBook[] = await Book.find(query);
    logger.info(`Found ${books.length} books matching the query`);
    res.json(books);
  } catch (error) {
    logger.error('Error searching books:', error);
    next(error);
  }
};

export const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info(`Creating new book: ${JSON.stringify(req.body)}`);
    const { name, category, rentPerDay } = req.body;
    const newBook = new Book({ name, category, rentPerDay });
    await newBook.save();
    logger.info(`Created new book with ID: ${newBook._id}`);
    res.status(201).json(newBook);
  } catch (error) {
    logger.error('Error creating book:', error);
    next(error);
  }
};