import { z } from 'zod';

import { electricityMeters } from '@workspace/utils/schemas/electricity';

export const monthSchema = z.object({
  date: z.preprocess(arg => {
    if (typeof arg === 'string') {
      return new Date(arg);
    }
    return arg;
  }, z.date()),
  meters: z.object({
    electricity: electricityMeters,
    water: z.number().nonnegative(),
    gas: z.number().nonnegative(),
  }),
});

export const monthSchemaClient = monthSchema.omit({ date: true }).extend({
  date: z.date(),
});
