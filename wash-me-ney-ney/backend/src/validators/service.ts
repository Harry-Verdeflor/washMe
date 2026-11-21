import { z } from 'zod';
import { text } from './common';

export const serviceBody = z
  .object({
    name: text(100).min(1, 'Name is required'),
    price: z.number().finite().min(0).max(100000),
    detail: text(300).default(''),
  })
  .strict();
