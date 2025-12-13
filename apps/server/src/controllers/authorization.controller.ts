import { NextFunction, Request, Response } from 'express';

import { authorizationService } from '../services';

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;

    const user = await authorizationService.auth({ token });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export default { auth };
