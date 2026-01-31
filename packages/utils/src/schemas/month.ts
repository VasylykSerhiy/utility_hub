import { electricitySchema } from '@workspace/utils/schemas/electricity';
import { z } from 'zod';

/** UA: Опційні поля для запису заміни лічильника (baseline = початок нового, oldFinal = останній показ старого). EN: Optional meter replacement fields. */
const replacementSchema = z
  .object({
    electricity: z
      .object({
        baselineSingle: z.coerce.number().nonnegative().optional(),
        baselineDay: z.coerce.number().nonnegative().optional(),
        baselineNight: z.coerce.number().nonnegative().optional(),
        oldFinalSingle: z.coerce.number().nonnegative().optional(),
        oldFinalDay: z.coerce.number().nonnegative().optional(),
        oldFinalNight: z.coerce.number().nonnegative().optional(),
      })
      .optional(),
    water: z
      .object({
        baseline: z.coerce.number().nonnegative().optional(),
        oldFinal: z.coerce.number().nonnegative().optional(),
      })
      .optional(),
    gas: z
      .object({
        baseline: z.coerce.number().nonnegative().optional(),
        oldFinal: z.coerce.number().nonnegative().optional(),
      })
      .optional(),
  })
  .optional();

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

  replacement: replacementSchema,
});

export const monthSchemaClient = monthSchema.omit({ date: true }).extend({
  date: z.date(),
});

export type ReplacementSchema = z.infer<typeof replacementSchema>;
