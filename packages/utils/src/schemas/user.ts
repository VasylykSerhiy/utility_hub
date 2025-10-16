import { z } from 'zod';

export const userAuthShema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(1, 'Please enter your password')
    .min(7, 'Password must be at least 7 characters long'),
});

export const userCreateShema = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .min(1, 'Please enter your password')
      .min(7, 'Password must be at least 7 characters long'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

export const userForgotPassword = z.object({
  email: z.string().email(),
});

export const userUpdatePassword = z.object({
  password: z
    .string()
    .min(1, 'Please enter your password')
    .min(7, 'Password must be at least 7 characters long'),
});
