import { NextFunction, Request, Response } from 'express';

import { getMyProfile } from '../utils/getProfile';

const myInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(getMyProfile(req.user!));
  } catch (error) {
    next(error);
  }
};

export default { myInfo };
