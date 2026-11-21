import { z } from 'zod';

export const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');

export const idParams = z.object({ id: objectId });

// Trimmed string with a length cap; control characters are rejected
const noControlChars = (s: string) => !/[\u0000-\u001F\u007F]/.test(s);

export const text = (max: number) =>
  z.string().trim().max(max).refine(noControlChars, 'Contains invalid characters');
