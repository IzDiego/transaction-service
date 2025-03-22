import mongoose from 'mongoose';
import { Transaction } from '../models/transaction.model';
import { logger } from '../utils/logger';
import dotenv from 'dotenv';

dotenv.config();

const generateTransactions = () => {
  const categories = {
    income: ['Salario', 'Freelance', 'Inversiones', 'Ventas', 'Depósito'],
    expense: ['Alimentación', 'Transporte', 'Vivienda', 'Ocio', 'Salud']
  };

  const clients = ['CLIENT001', 'CLIENT002', 'CLIENT003', 'CLIENT004', 'CLIENT005'];
  const transactions = [];

  for (let i = 0; i < 40; i++) {
    const isIncome = Math.random() > 0.4;
    const categoryType = isIncome ? 'income' : 'expense';
    const amount = isIncome 
      ? Math.floor(Math.random() * 2000) + 500
      : (Math.floor(Math.random() * 800) + 100) * -1;

    transactions.push({
      client_id: clients[Math.floor(Math.random() * clients.length)],
      amount: amount,
      category: categories[categoryType][Math.floor(Math.random() * 5)],
      date: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      type: isIncome ? 'income' : 'expense',
      state: Math.random() > 0.2 ? 'activa' : 'desactivada'
    });
  }

  // Transacciones específicas de ejemplo
  return [
    ...transactions,
    {
      client_id: 'CLIENT001',
      amount: 1500,
      category: 'Salario',
      date: new Date('2024-01-05'),
      type: 'income',
      state: 'activa'
    },
    {
      client_id: 'CLIENT002',
      amount: -120,
      category: 'Transporte',
      date: new Date('2024-02-15'),
      type: 'expense',
      state: 'desactivada'
    },
    {
      client_id: 'CLIENT003',
      amount: 3000,
      category: 'Inversiones',
      date: new Date('2024-03-10'),
      type: 'income',
      state: 'activa'
    }
  ];
};

const sampleTransactions = generateTransactions();

const seedDatabase = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://mongadmin:mongobongo2025@localhost:27017/transaction-service?authSource=admin'
    );
    logger.info('Connected to MongoDB');

    await Transaction.deleteMany({});
    logger.info('Cleared existing transactions');

    await Transaction.insertMany(sampleTransactions);
    logger.info(`Inserted ${sampleTransactions.length} sample transactions`);

    logger.info('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();