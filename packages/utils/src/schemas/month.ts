import { z } from 'zod';

import { electricitySchema } from '@workspace/utils/schemas/electricity';

export const monthSchema = z.object({
  date: z.preprocess(arg => {
    if (typeof arg === 'string' || typeof arg === 'number') {
      return new Date(arg);
    }
    return arg;
  }, z.date()),

  meters: z.object({
    electricity: electricitySchema,
    water: z.coerce.number().nonnegative(),
    gas: z.coerce.number().nonnegative(),
  }),
});

export const monthSchemaClient = monthSchema.omit({ date: true }).extend({
  date: z.date(),
});
