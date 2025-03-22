import * as XLSX from 'xlsx';
import { ITransaction } from '../models/transaction.model';
import { logger } from '../utils/logger';
import * as fs from 'fs';
import * as path from 'path';

export const generateReport = async (transactions: ITransaction[]): Promise<string> => {
  try {
    // Create reports directory if it doesn't exist
    const reportsDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir);
    }

    // Prepare data for Excel
    const data = transactions.map(transaction => ({
      Date: transaction.date.toISOString().split('T')[0],
      Amount: transaction.amount,
      Category: transaction.category,
      'Client ID': transaction.client_id,
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `transaction-report-${timestamp}.xlsx`;
    const filepath = path.join(reportsDir, filename);

    // Write file
    XLSX.writeFile(workbook, filepath);

    logger.info(`Report generated successfully: ${filename}`);
    return filename;
  } catch (error) {
    logger.error('Error generating report:', error);
    throw error;
  }
};

export const listReports = async (): Promise<Array<{ filename: string; createdAt: Date }>> => {
  try {
    const reportsDir = path.join(process.cwd(), 'reports');
    
    if (!fs.existsSync(reportsDir)) {
      return [];
    }

    const files = fs.readdirSync(reportsDir);
    const reports = files
      .filter(file => file.endsWith('.xlsx'))
      .map(filename => {
        const filepath = path.join(reportsDir, filename);
        const stats = fs.statSync(filepath);
        return {
          filename,
          createdAt: stats.birthtime,
        };
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return reports;
  } catch (error) {
    logger.error('Error listing reports:', error);
    throw error;
  }
}; 