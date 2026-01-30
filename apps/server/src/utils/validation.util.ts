import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';
import { ZodError } from 'zod';

export const validateRequest =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: 'Validation Error',
          errors: error.issues,
        });
      }

      next(error);
    }
  };
