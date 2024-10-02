import express from 'express';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import bookRoutes from './routes/bookRoutes';
import userRoutes from './routes/userRoutes';
import transactionRoutes from './routes/transactionRoutes';
import { errorHandler } from './middleware/errorHandler';
import logger from './utils/logger';

const app = express();

app.use(cors());
app.use(express.json());

app.use(mongoSanitize());

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

app.use(errorHandler);

export default app;