import { Router } from 'express';

import dashboardController from '../controllers/dashboard.controller';
import { authMiddleware } from '../middlewares';

const dashboardRouter = Router();

dashboardRouter.get(
  '/',
  authMiddleware.requireAuth,
  dashboardController.getDashboardAnalytics,
);

export default dashboardRouter;
