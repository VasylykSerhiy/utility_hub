import { z } from 'zod';

export const electricityMeters = z.union([
  z.object({
    type: z.literal('single'),
    single: z.number().nonnegative(),
  }),
  z.object({
    type: z.literal('double'),
    day: z.number().nonnegative(),
    night: z.number().nonnegative(),
  }),
]);

export type ElectricityMeters = z.infer<typeof electricityMeters>;
