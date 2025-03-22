import { Router } from 'express';
import { Transaction } from '../models/transaction.model';
import { AppError } from '../middleware/error.middleware';
import { logger } from '../utils/logger';
import { Request, Response, NextFunction } from 'express';

const router = Router();

// Get transactions by category
router.get('/by-category', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transactions = await Transaction.aggregate([
      { $match: { state: 'activa' } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.json(transactions);
  } catch (error) {
    next(error);
  }
});

// Get transactions by date range
router.get('/by-date', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      throw new AppError('Start date and end date are required', 400);
    }

    const transactions = await Transaction.aggregate([
      {
        $match: {
          state: 'activa',
          date: {
            $gte: new Date(startDate as string),
            $lte: new Date(endDate as string),
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(transactions);
  } catch (error) {
    next(error);
  }
});

// Get transactions by client
router.get('/by-client', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transactions = await Transaction.aggregate([
      { $match: { state: 'activa' } },
      {
        $group: {
          _id: '$client_id',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.json(transactions);
  } catch (error) {
    next(error);
  }
});

export const metricsRoutes = router; 