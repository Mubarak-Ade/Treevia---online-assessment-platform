import { z } from 'zod';

export const healthResponseSchema = z.object({
  status: z.literal('ok'),
  database: z.enum(['connected', 'unavailable']),
  timestamp: z.string().datetime(),
});
