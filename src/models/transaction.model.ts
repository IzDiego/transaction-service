import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  amount: number;
  category: string;
  date: Date;
  client_id: string;
  createdAt: Date;
  updatedAt: Date;
  state: string;
  type: string;
}

const transactionSchema = new Schema<ITransaction>(
  {
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    client_id: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      default: 'activa',
    },
    type: {
      type: String,
      default: 'income',
    },
  },
  {
    timestamps: true,
  }
);

export const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema); 