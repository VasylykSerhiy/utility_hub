import { NextFunction, Request, Response } from 'express';

import { monthService } from '../services';

const getMonths = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!req.params?.propertyId) {
      return res.status(400).json({ message: 'Property ID is required' });
    }

    const months = await monthService.getMonths({
      user: req.user,
      propertyId: req.params?.propertyId,
    });

    res.json(months);
  } catch (error) {
    next(error);
  }
};

const createMonth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const property = await monthService.createMonth({
      user: req.user!,
      data: req.body,
    });

    res.json(property);
  } catch (error) {
    next(error);
  }
};

export default { createMonth, getMonths };
