import { monthSchema, updateMonthSchema } from '@workspace/utils/schemas/month';
import {
  addMemberSchema,
  createPropertySchema,
  updateMemberRoleSchema,
  updatePropertySchema,
} from '@workspace/utils/schemas/property';
import { Router } from 'express';

import { propertyController } from '../controllers';
import { authMiddleware } from '../middlewares';
import { validateRequest } from '../utils/validation.util';

const propertyRouter = Router();

propertyRouter.get('/', authMiddleware.requireAuth, propertyController.getProperties);

propertyRouter.get('/:id', authMiddleware.requireAuth, propertyController.getProperty);

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

propertyRouter.delete('/:id', authMiddleware.requireAuth, propertyController.deleteProperty);

propertyRouter.get('/:id/months', authMiddleware.requireAuth, propertyController.getMonths);

propertyRouter.get('/:id/months/:monthId', authMiddleware.requireAuth, propertyController.getMonth);

propertyRouter.post(
  '/:id/months',
  authMiddleware.requireAuth,
  validateRequest(monthSchema),
  propertyController.createMonth,
);

propertyRouter.put(
  '/:id/months/:monthId',
  authMiddleware.requireAuth,
  validateRequest(updateMonthSchema),
  propertyController.editMonth,
);
propertyRouter.delete(
  '/:id/months/:monthId',
  authMiddleware.requireAuth,
  propertyController.deleteMonth,
);

propertyRouter.get(
  '/:id/last-tariff',
  authMiddleware.requireAuth,
  propertyController.getLastTariff,
);

propertyRouter.get('/:id/tariffs', authMiddleware.requireAuth, propertyController.getTariffs);

propertyRouter.get('/:id/metrics', authMiddleware.requireAuth, propertyController.getMetrics);

propertyRouter.get(
  '/:id/members',
  authMiddleware.requireAuth,
  propertyController.getPropertyMembers,
);
propertyRouter.get(
  '/:id/audit-log',
  authMiddleware.requireAuth,
  propertyController.getPropertyAuditLog,
);
propertyRouter.post(
  '/:id/members',
  authMiddleware.requireAuth,
  validateRequest(addMemberSchema),
  propertyController.addPropertyMember,
);
propertyRouter.patch(
  '/:id/members/:memberId',
  authMiddleware.requireAuth,
  validateRequest(updateMemberRoleSchema),
  propertyController.updatePropertyMemberRole,
);
propertyRouter.delete(
  '/:id/members/:memberId',
  authMiddleware.requireAuth,
  propertyController.removePropertyMember,
);

export default propertyRouter;
