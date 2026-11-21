import { Schema, model } from 'mongoose';
import { schemaOptions } from './schemaOptions';

export const Service = model(
  'Service',
  new Schema(
    {
      name: { type: String, required: true, trim: true, maxlength: 100 },
      price: { type: Number, required: true, min: 0 },
      detail: { type: String, trim: true, default: '', maxlength: 300 },
    },
    schemaOptions
  )
);
