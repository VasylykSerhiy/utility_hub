import { Router } from 'express';

import authRouter from './auth.routes';
import userRouter from './user.routes';

const routes = Router();

routes.use('/auth', authRouter);
routes.use('/users', userRouter);

export default routes;
