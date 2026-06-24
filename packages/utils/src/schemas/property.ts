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

/** UA: Зміна ролі учасника об'єкта (viewer | admin). EN: Update property member role. */
export const updateMemberRoleSchema = z.object({
  role: z.enum(['viewer', 'admin']),
});

/** UA: Додавання учасника за email або userId. EN: Add property member by email or userId. */
export const addMemberSchema = z
  .object({
    email: z.string().email().optional(),
    userId: z.string().uuid().optional(),
    role: z.enum(['viewer', 'admin']).optional(),
  })
  .refine(data => Boolean(data.email?.trim()) !== Boolean(data.userId?.trim()), {
    message: 'Provide either email or userId',
  });
