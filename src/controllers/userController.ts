import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/User';
import logger from '../utils/logger';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('Fetching all users');
    const users: IUser[] = await User.find();
    logger.info(`Retrieved ${users.length} users`);
    res.json(users);
  } catch (error) {
    logger.error('Error fetching users:', error);
    next(error);
  }
};

export const searchUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info(`Searching users with query: ${JSON.stringify(req.query)}`);
    const { name } = req.query;
    let query: any = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    const users: IUser[] = await User.find(query);
    logger.info(`Found ${users.length} users matching the query`);
    res.json(users);
  } catch (error) {
    logger.error('Error searching users:', error);
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info(`Creating new user: ${JSON.stringify(req.body)}`);
    const { name, email } = req.body;
    const newUser = new User({ name, email });
    await newUser.save();
    logger.info(`Created new user with ID: ${newUser._id}`);
    res.status(201).json(newUser);
  } catch (error) {
    logger.error('Error creating user:', error);
    next(error);
  }
};