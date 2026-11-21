import { z } from 'zod';
import { text } from './common';

export const customerBody = z
  .object({
    name: text(100).min(1, 'Name is required'),
    phone: text(30).regex(/^[0-9+()\s-]*$/, 'Phone may only contain digits, spaces and + ( ) -').default(''),
    email: z.union([z.literal(''), z.string().trim().max(254).email('Invalid email address')]).default(''),
  })
  .strict();
