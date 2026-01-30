import type z from 'zod';

import type { authSchema } from './auth';
import type { monthSchemaClient } from './month';
import type { createPropertySchema, propertySchema, updatePropertySchema } from './property';
import type {
  userAuthShema,
  userCreateShema,
  userForgotPassword,
  userUpdatePassword,
} from './user';

export type AuthInput = z.infer<typeof authSchema>;
export type MonthSchema = z.infer<typeof monthSchemaClient>;

export type PropertySchema = z.infer<typeof propertySchema>;
export type CreatePropertySchema = z.infer<typeof createPropertySchema>;
export type UpdatePropertySchema = z.infer<typeof updatePropertySchema>;

export type UserAuthShema = z.infer<typeof userAuthShema>;
export type UserCreateShema = z.infer<typeof userCreateShema>;
export type UserForgotPassword = z.infer<typeof userForgotPassword>;
export type UserUpdatePassword = z.infer<typeof userUpdatePassword>;
