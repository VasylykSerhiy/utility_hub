import type { Request } from 'express';

import { assertFound } from './http-errors';

export const getUserId = (req: Request): string => {
  assertFound(req.user, 'User ID missing in request');
  return req.user.id;
};
