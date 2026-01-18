import { NextFunction, Request, Response } from 'express';

import { propertyService, readingService, tariffService } from '../services';

const getUserId = (req: Request): string => {
  if (!req.user?.id) throw new Error('User ID missing in request');
  return req.user.id;
};

const getProperties = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = getUserId(req);
    const properties = await propertyService.getProperties(userId);
    res.json(properties);
  } catch (error) {
    next(error);
  }
};

const getProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    if (!id)
      return res.status(400).json({ message: 'Property ID is required' });

    const property = await propertyService.getProperty(userId, id);
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
    const userId = getUserId(req);

    const property = await propertyService.createProperty({
      userId,
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
    const userId = getUserId(req);
    const { id } = req.params;

    if (!id)
      return res.status(400).json({ message: 'Property ID is required' });

    const property = await propertyService.updateProperty({
      userId,
      propertyId: id,
      data: req.body,
    });

    res.json(property);
  } catch (error) {
    next(error);
  }
};

const deleteProperty = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    if (!id)
      return res.status(400).json({ message: 'Property ID is required' });

    await propertyService.deleteProperty({
      userId,
      propertyId: id,
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const getMonths = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({ message: 'Property ID is required' });

    const months = await readingService.getMonths({
      propertyId: id,
      page: Number(req.query.page) || 1,
      pageSize: Number(req.query.pageSize) || 10,
    });

    res.json(months);
  } catch (error) {
    next(error);
  }
};

const getMonth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const { id, monthId } = req.params;
    if (!id)
      return res.status(400).json({ message: 'Property ID is required' });

    if (!monthId)
      return res.status(400).json({ message: 'Month ID is required' });

    const month = await readingService.getMonth({
      propertyId: id,
      monthId,
      userId,
    });

    res.json(month);
  } catch (error) {
    next(error);
  }
};

const editMonth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, monthId } = req.params;

    if (!id)
      return res.status(400).json({ message: 'Property ID is required' });
    if (!monthId)
      return res.status(400).json({ message: 'Month ID is required' });

    const month = await readingService.editMonth({
      propertyId: id,
      monthId,
      data: req.body,
    });

    res.json(month);
  } catch (error) {
    next(error);
  }
};

const deleteMonth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, monthId } = req.params;

    if (!id)
      return res.status(400).json({ message: 'Property ID is required' });
    if (!monthId)
      return res.status(400).json({ message: 'Month ID is required' });

    await readingService.deleteMonth({
      propertyId: id,
      monthId,
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const createMonth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    if (!id)
      return res.status(400).json({ message: 'Property ID is required' });

    const month = await readingService.createMonth({
      userId,
      propertyId: id,
      data: req.body,
    });

    res.json(month);
  } catch (error) {
    next(error);
  }
};

const getLastTariff = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({ message: 'Property ID is required' });

    const tariff = await tariffService.getLastTariff(id);
    res.json(tariff);
  } catch (error) {
    next(error);
  }
};

const getTariffs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({ message: 'Property ID is required' });

    const tariffs = await tariffService.getTariffs({
      propertyId: id,
      page: Number(req.query.page) || 1,
      pageSize: Number(req.query.pageSize) || 10,
    });

    res.json(tariffs);
  } catch (error) {
    next(error);
  }
};

const getMetrics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({ message: 'Property ID is required' });

    const result = await propertyService.getMetrics({ propertyId: id });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  createProperty,
  getProperties,
  updateProperty,
  deleteProperty,
  getMonths,
  getMonth,
  createMonth,
  editMonth,
  deleteMonth,
  getProperty,
  getLastTariff,
  getTariffs,
  getMetrics,
};
