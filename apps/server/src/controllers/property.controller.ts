import { NextFunction, Request, Response } from 'express';

import { propertyService } from '../services';

const getProperties = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const property = await propertyService.getProperties(req.user);
    res.json(property);
  } catch (error) {
    next(error);
  }
};

const createProperty = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const property = await propertyService.createProperty({
      user: req.user!,
      data: req.body,
    });

    res.json(property);
  } catch (error) {
    next(error);
  }
};

const updateProperty = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.params?.id) {
      return res.status(400).json({ message: 'Property ID is required' });
    }

    const property = await propertyService.updateProperty({
      user: req.user!,
      id: req.params.id,
      data: req.body,
    });

    res.json(property);
  } catch (error) {
    next(error);
  }
};

const getMonths = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.params?.id) {
      return res.status(400).json({ message: 'Property ID is required' });
    }

    const months = await propertyService.getMonths({
      user: req.user!,
      propertyId: req.params?.id,
    });

    res.json(months);
  } catch (error) {
    next(error);
  }
};

const createMonth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.params?.id) {
      return res.status(400).json({ message: 'Property ID is required' });
    }

    const property = await propertyService.createMonth({
      user: req.user!,
      propertyId: req.params?.id,
      data: req.body,
    });

    res.json(property);
  } catch (error) {
    next(error);
  }
};

export default {
  createProperty,
  getProperties,
  updateProperty,
  getMonths,
  createMonth,
};
