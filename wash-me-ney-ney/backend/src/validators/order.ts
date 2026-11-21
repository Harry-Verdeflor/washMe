import { z } from 'zod';
import { objectId } from './common';
import { STATUSES, PAYMENTS } from '../models';

const weight = z.number().finite().min(0.1).max(1000);

export const createOrderBody = z
  .object({
    customerId: objectId,
    serviceId: objectId,
    weight,
    status: z.enum(STATUSES).default('Pending'),
    payment: z.enum(PAYMENTS).default('Unpaid'),
  })
  .strict();

export const updateOrderBody = z
  .object({
    customerId: objectId,
    serviceId: objectId,
    weight,
    status: z.enum(STATUSES),
    payment: z.enum(PAYMENTS),
  })
  .partial()
  .strict()
  .refine((o) => Object.keys(o).length > 0, 'Provide at least one field to update');
