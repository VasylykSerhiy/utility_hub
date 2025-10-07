import { monthSchema } from '@workspace/utils';
import { Router } from 'express';

import { monthController } from '../controllers';
import { authMiddleware } from '../middlewares';
import { validateRequest } from '../utils/validation.util';

const monthRouter = Router();

monthRouter.get('/:propertyId', authMiddleware.requireAuth, monthController.getMonths);

monthRouter.post(
  '/',
  authMiddleware.requireAuth,
  validateRequest(monthSchema),
  monthController.createMonth,
);

export default monthRouter;
