import { Router } from 'express';
import { body } from 'express-validator';
import { Transaction } from '../models/transaction.model';
import { AppError } from '../middleware/error.middleware';
import { logger } from '../utils/logger';
import { Request, Response, NextFunction } from 'express';


const router = Router();

// Validation middleware
const validateTransaction = [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('date').isISO8601().withMessage('Date must be a valid ISO date'),
  body('clientId').notEmpty().withMessage('Client ID is required'),
];

// Create transaction
router.post('/', validateTransaction, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    logger.info(`Created new transaction: ${transaction._id}, ${transaction.state}, ${req.body.state}`);
    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
});

// Get all transactions
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transactions = await Transaction.find({ state: 'activa' });
    res.json(transactions);
  } catch (error) {
    next(error);
  }
});

// Get transaction by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      state: 'activa',
    });
    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }
    res.json(transaction);
  } catch (error) {
    next(error);
  }
});

// Update transaction
router.put('/:id', validateTransaction, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, state: 'activa' },
      req.body,
      { new: true, runValidators: true }
    );
    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }
    logger.info(`Updated transaction: ${transaction._id}`);
    res.json(transaction);
  } catch (error) {
    next(error);
  }
});

// Deactivate transaction (soft delete)
router.delete('/:id', async (req: Request, res: Response, next: NextFunction ) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, state: 'activa' },
      { state: 'desactivada' },
      { new: true }
    );
    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }
    logger.info(`Deactivated transaction: ${transaction._id}`);
    res.json({ message: 'Transaction deactivated successfully' });
  } catch (error) {
    next(error);
  }
});

export const transactionRoutes = router; 