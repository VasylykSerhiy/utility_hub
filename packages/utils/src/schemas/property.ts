import z from 'zod';

export const tariffsSchema = z.object({
  electricityDay: z.number().nonnegative().optional(),
  electricityNight: z.number().nonnegative().optional(),
  water: z.number().nonnegative().optional(),
  gas: z.number().nonnegative().optional(),
});

export const fixedCostsSchema = z.object({
  internet: z.number().nonnegative().optional(),
  maintenance: z.number().nonnegative().optional(),
});

export const propertySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  tariffs: tariffsSchema.optional(),
  fixedCosts: fixedCostsSchema.optional(),
});

export type PropertySchema = z.infer<typeof propertySchema>;
