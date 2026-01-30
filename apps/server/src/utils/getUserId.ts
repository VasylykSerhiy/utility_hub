import type { Request } from 'express';

export const getUserId = (req: Request): string => {
  if (!req.user?.id) throw new Error('User ID missing in request');
  return req.user.id;
};
