import { z } from 'zod';

export const monthSchema = z.object({
  propertyId: z.string().min(1),
  date: z.preprocess(arg => {
    if (typeof arg === 'string') {
      return new Date(arg);
    }
    return arg;
  }, z.date()),
  meters: z.object({
    electricityDay: z.number().nonnegative(),
    electricityNight: z.number().nonnegative(),
    water: z.number().nonnegative(),
    gas: z.number().nonnegative(),
  }),
});

export type MonthSchema = z.infer<typeof monthSchema>;
