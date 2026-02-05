import type { NextFunction, Request, Response } from 'express';

import { auditService, propertyService, readingService, tariffService } from '../services';
import { ensureStrictOwner } from '../services/property-access.service';

const getUserId = (req: Request): string => {
  if (!req.user?.id) throw new Error('User ID missing in request');
  return req.user.id;
};

const getActorEmail = (req: Request): string | undefined =>
  (req.user as { email?: string } | undefined)?.email;

const getProperties = async (req: Request, res: Response, next: NextFunction) => {
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

    if (!id) return res.status(400).json({ message: 'Property ID is required' });

    const property = await propertyService.getProperty(userId, id);
    res.json(property);
  } catch (error) {
    next(error);
  }
};

const createProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);

    const property = await propertyService.createProperty({
      userId,
      data: req.body,
      actorEmail: getActorEmail(req),
    });

    res.json(property);
  } catch (error) {
    next(error);
  }
};

const updateProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: 'Property ID is required' });

    const property = await propertyService.updateProperty({
      userId,
      propertyId: id,
      data: req.body,
      actorEmail: getActorEmail(req),
    });

    res.json(property);
  } catch (error) {
    next(error);
  }
};

const deleteProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: 'Property ID is required' });

    await propertyService.deleteProperty({
      userId,
      propertyId: id,
      actorEmail: getActorEmail(req),
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const getMonths = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Property ID is required' });

    const months = await readingService.getMonths({
      userId,
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
    if (!id) return res.status(400).json({ message: 'Property ID is required' });

    if (!monthId) return res.status(400).json({ message: 'Month ID is required' });

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
    const userId = getUserId(req);
    const { id, monthId } = req.params;

    if (!id) return res.status(400).json({ message: 'Property ID is required' });
    if (!monthId) return res.status(400).json({ message: 'Month ID is required' });

    const month = await readingService.editMonth({
      userId,
      propertyId: id,
      monthId,
      data: req.body,
      actorEmail: getActorEmail(req),
    });

    res.json(month);
  } catch (error) {
    next(error);
  }
};

const deleteMonth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const { id, monthId } = req.params;

    if (!id) return res.status(400).json({ message: 'Property ID is required' });
    if (!monthId) return res.status(400).json({ message: 'Month ID is required' });

    await readingService.deleteMonth({
      userId,
      propertyId: id,
      monthId,
      actorEmail: getActorEmail(req),
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

    if (!id) return res.status(400).json({ message: 'Property ID is required' });

    const month = await readingService.createMonth({
      userId,
      propertyId: id,
      data: req.body,
      actorEmail: getActorEmail(req),
    });

    res.json(month);
  } catch (error) {
    next(error);
  }
};

const getLastTariff = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Property ID is required' });

    const tariff = await tariffService.getLastTariff(userId, id);
    res.json(tariff);
  } catch (error) {
    next(error);
  }
};

const getTariffs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Property ID is required' });

    const tariffs = await tariffService.getTariffs({
      userId,
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
    const userId = getUserId(req);
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Property ID is required' });

    const result = await propertyService.getMetrics({ userId, propertyId: id });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getPropertyMembers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Property ID is required' });

    const members = await propertyService.getPropertyMembers(userId, id);
    res.json(members);
  } catch (error) {
    next(error);
  }
};

const addPropertyMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;
    const body = req.body as { email?: string; userId?: string; role?: 'viewer' | 'admin' };
    if (!id) return res.status(400).json({ message: 'Property ID is required' });
    const hasEmail = Boolean(body?.email?.trim());
    const hasUserId = Boolean(body?.userId?.trim());
    if (hasEmail === hasUserId) {
      return res.status(400).json({ message: 'Provide either email or userId' });
    }

    const email = hasEmail && body.email ? body.email.trim() : undefined;
    const memberUserIdParam = !hasEmail && body.userId ? body.userId.trim() : undefined;
    await propertyService.addPropertyMember({
      userId,
      propertyId: id,
      ...(email !== undefined ? { email } : { memberUserId: memberUserIdParam ?? '' }),
      ...(body.role && { role: body.role }),
      actorEmail: getActorEmail(req),
    });
    res.status(201).json({ success: true });
  } catch (error) {
    next(error);
  }
};

const updatePropertyMemberRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const { id, memberId } = req.params;
    const body = req.body as { role: 'viewer' | 'admin' };
    if (!id) return res.status(400).json({ message: 'Property ID is required' });
    if (!memberId) return res.status(400).json({ message: 'Member user ID is required' });
    if (!body?.role || !['viewer', 'admin'].includes(body.role)) {
      return res.status(400).json({ message: 'role must be viewer or admin' });
    }

    await propertyService.updatePropertyMemberRole({
      userId,
      propertyId: id,
      memberUserId: memberId,
      role: body.role,
      actorEmail: getActorEmail(req),
    });
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

const removePropertyMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const { id, memberId } = req.params;
    if (!id) return res.status(400).json({ message: 'Property ID is required' });
    if (!memberId) return res.status(400).json({ message: 'Member user ID is required' });

    await propertyService.removePropertyMember({
      userId,
      propertyId: id,
      memberUserId: memberId,
      actorEmail: getActorEmail(req),
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const getPropertyAuditLog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;
    const page = Math.max(1, Number(req.query.page) || 1);
    const pageSize = Math.min(50, Math.max(1, Number(req.query.pageSize) || 20));
    if (!id) return res.status(400).json({ message: 'Property ID is required' });

    await ensureStrictOwner(userId, id);
    const result = await auditService.getAuditLog(id, page, pageSize);
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
  getPropertyMembers,
  getPropertyAuditLog,
  addPropertyMember,
  updatePropertyMemberRole,
  removePropertyMember,
};
