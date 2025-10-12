import z from 'zod';

import { authSchema } from './auth';
import { electricityMeters } from './electricity';
import { monthSchemaClient } from './month';
import {
  createPropertySchema,
  propertySchema,
  updatePropertySchema,
} from './property';
import { userAuthShema, userCreateShema, userForgotPassword } from './user';

export type AuthInput = z.infer<typeof authSchema>;
export type ElectricityMeters = z.infer<typeof electricityMeters>;
export type MonthSchema = z.infer<typeof monthSchemaClient>;

export type PropertySchema = z.infer<typeof propertySchema>;
export type CreatePropertySchema = z.infer<typeof createPropertySchema>;
export type UpdatePropertySchema = z.infer<typeof updatePropertySchema>;

export type UserAuthShema = z.infer<typeof userAuthShema>;
export type UserCreateShema = z.infer<typeof userCreateShema>;
export type UserForgotPassword = z.infer<typeof userForgotPassword>;
