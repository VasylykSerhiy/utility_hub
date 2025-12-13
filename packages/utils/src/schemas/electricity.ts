import { z } from 'zod';

export const electricitySchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('single'),
    single: z.coerce.number().nonnegative(),
  }),
  z.object({
    type: z.literal('double'),
    day: z.coerce.number().nonnegative(),
    night: z.coerce.number().nonnegative(),
  }),
]);
