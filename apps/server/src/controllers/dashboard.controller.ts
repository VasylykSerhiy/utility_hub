import type { NextFunction, Request, Response } from 'express';

import { dashboardService } from '../services';
import { getUserId } from '../utils';

const getDashboardAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const properties = await dashboardService.getDashboardAnalytics(userId);
    res.json(properties);
  } catch (error) {
    next(error);
  }
};

export default {
  getDashboardAnalytics,
};
