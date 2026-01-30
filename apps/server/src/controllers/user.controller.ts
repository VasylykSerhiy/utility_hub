import type { NextFunction, Request, Response } from 'express';
import { getMyProfile } from '../utils/getProfile';

const myInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    res.json(getMyProfile(req.user));
  } catch (error) {
    next(error);
  }
};

export default { myInfo };
