import { Schema, model } from 'mongoose';
import { schemaOptions } from './schemaOptions';

export const STATUSES = ['Pending', 'Washing', 'Drying', 'Folding', 'Ready', 'Completed', 'Cancelled'] as const;
export const PAYMENTS = ['Unpaid', 'Paid'] as const;

export const Order = model(
  'Order',
  new Schema(
    {
      code: { type: String, required: true, unique: true },
      customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
      serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
      weight: { type: Number, required: true, min: 0.1 },
      price: { type: Number, required: true, min: 0 },
      status: { type: String, enum: STATUSES, default: 'Pending' },
      payment: { type: String, enum: PAYMENTS, default: 'Unpaid' },
      date: { type: String, required: true }, // YYYY-MM-DD
    },
    schemaOptions
  )
);
