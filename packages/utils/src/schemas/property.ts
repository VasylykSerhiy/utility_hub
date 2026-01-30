import { electricitySchema } from '@workspace/utils/schemas/electricity';
import z from 'zod';

export const tariffsSchema = z.object({
  electricity: electricitySchema,
  water: z.number().nonnegative(),
  gas: z.number().nonnegative(),
});

export const fixedCostsSchema = z.object({
  internet: z.number().nonnegative(),
  maintenance: z.number().nonnegative(),
  gas_delivery: z.number().nonnegative(),
});

export const propertySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  tariffs: tariffsSchema.optional(),
  fixedCosts: fixedCostsSchema.optional(),
});

export const createPropertySchema = propertySchema.required();
export const updatePropertySchema = propertySchema.omit({ name: true });
