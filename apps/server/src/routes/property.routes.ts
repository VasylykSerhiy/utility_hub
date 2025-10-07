import { propertySchema } from '@workspace/utils';
import { Router } from 'express';

import { propertyController } from '../controllers';
import { authMiddleware } from '../middlewares';
import { validateRequest } from '../utils/validation.util';

const propertyRouter = Router();

propertyRouter.get('/', authMiddleware.requireAuth, propertyController.getProperties);

propertyRouter.post(
  '/',
  authMiddleware.requireAuth,
  validateRequest(propertySchema),
  propertyController.createProperty,
);

propertyRouter.put('/:id', authMiddleware.requireAuth, propertyController.updateProperty);

export default propertyRouter;
