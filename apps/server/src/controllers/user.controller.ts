import { NextFunction, Request, Response } from 'express';

const myInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(req.user);
  } catch (error) {
    next(error);
  }
};

export default { myInfo };
