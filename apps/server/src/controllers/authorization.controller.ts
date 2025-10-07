import { NextFunction, Request, Response } from 'express';

import { authorizationService } from '../services';

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authorizationService.auth(req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export default { auth };
