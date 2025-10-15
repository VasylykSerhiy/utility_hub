import { Router } from 'express';

import { monthSchema } from '@workspace/utils/schemas/month';
import {
  createPropertySchema,
  updatePropertySchema,
} from '@workspace/utils/schemas/property';

import { propertyController } from '../controllers';
import { authMiddleware } from '../middlewares';
import { validateRequest } from '../utils/validation.util';

const propertyRouter = Router();

propertyRouter.get(
  '/',
  authMiddleware.requireAuth,
  propertyController.getProperties,
);

propertyRouter.get(
  '/:id',
  authMiddleware.requireAuth,
  propertyController.getProperty,
);

propertyRouter.post(
  '/',
  authMiddleware.requireAuth,
  validateRequest(createPropertySchema),
  propertyController.createProperty,
);

propertyRouter.put(
  '/:id',
  authMiddleware.requireAuth,
  validateRequest(updatePropertySchema),
  propertyController.updateProperty,
);

propertyRouter.get(
  '/:id/months',
  authMiddleware.requireAuth,
  propertyController.getMonths,
);

propertyRouter.post(
  '/:id/months',
  authMiddleware.requireAuth,
  validateRequest(monthSchema),
  propertyController.createMonth,
);

propertyRouter.get(
  '/:id/last-tariff',
  authMiddleware.requireAuth,
  propertyController.getLastTariff,
);

propertyRouter.get(
  '/:id/tariffs',
  authMiddleware.requireAuth,
  propertyController.getTariffs,
);

propertyRouter.get(
  '/:id/metrics',
  authMiddleware.requireAuth,
  propertyController.getMetrics,
);

export default propertyRouter;
