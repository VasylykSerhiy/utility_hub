import z from 'zod';

export const authSchema = z.object({
  token: z
    .string({
      required_error: 'Token is required',
      invalid_type_error: 'Token must be a string',
    })
    .min(10, 'Token must be at least 10 characters long'),
});

export type AuthInput = z.infer<typeof authSchema>;
