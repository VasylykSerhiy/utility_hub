import { Router } from 'express';

import { userController } from '../controllers';
import { authMiddleware } from '../middlewares';

const userRouter = Router();

userRouter.get('/me', authMiddleware.requireAuth, userController.myInfo);

export default userRouter;
