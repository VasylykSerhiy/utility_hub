import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

export const validateRequest =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof Error && 'issues' in error) {
        return res.status(400).json({
          message: 'Validation Error',
          errors: (error as any).issues,
        });
      }

      next(error);
    }
  };
