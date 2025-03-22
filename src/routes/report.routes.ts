import { Router } from 'express';
import { body } from 'express-validator';
import { Transaction } from '../models/transaction.model';
import { generateReport, listReports } from '../services/report.service';
import { AppError } from '../middleware/error.middleware';
import { logger } from '../utils/logger';
import { Request, Response, NextFunction } from 'express';

const router = Router();

// Validation middleware
const validateReportRequest = [
  body('startDate').isISO8601().withMessage('Start date must be a valid ISO date'),
  body('endDate').isISO8601().withMessage('End date must be a valid ISO date'),
  body('clientId').optional().isString(),
  body('category').optional().isString(),
];

// List all reports
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reports = await listReports();
    res.json(reports);
  } catch (error) {
    next(error);
  }
});

// Generate report
router.post('/generate', validateReportRequest, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate, clientId, category } = req.body;

    const query: any = {
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
      state: 'activa',
    };

    if (clientId) {
      query.client_id = clientId;
    }

    if (category) {
      query.type = category;
    }

    const transactions = await Transaction.find(query).sort({ date: 1 });
    
    if (transactions.length === 0) {
      throw new AppError('No transactions found for the specified criteria', 404);
    }

    const reportPath = await generateReport(transactions);
    logger.info(`Generated report: ${reportPath}`);
    
    res.json({
      message: 'Report generated successfully',
      downloadUrl: `/api/reports/download/${reportPath}`,
    });
  } catch (error) {
    next(error);
  }
});

// Download report
router.get('/download/:filename', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { filename } = req.params;
    const filePath = `./reports/${filename}`;
    
    res.download(filePath, filename, (err) => {
      if (err) {
        logger.error(`Error downloading report: ${err.message}`);
      }
    });
  } catch (error) {
    next(error);
  }
});

export const reportRoutes = router; 