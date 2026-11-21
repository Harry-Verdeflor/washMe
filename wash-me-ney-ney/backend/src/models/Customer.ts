import { Schema, model } from 'mongoose';
import { schemaOptions } from './schemaOptions';

export const Customer = model(
  'Customer',
  new Schema(
    {
      name: { type: String, required: true, trim: true, maxlength: 100 },
      phone: { type: String, trim: true, default: '', maxlength: 30 },
      email: { type: String, trim: true, default: '', maxlength: 254 },
    },
    schemaOptions
  )
);
