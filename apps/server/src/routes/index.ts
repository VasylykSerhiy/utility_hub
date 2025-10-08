import { Router } from 'express';

import authRouter from './auth.routes';
import propertyRouter from './property.routes';
import userRouter from './user.routes';

const routes = Router();

routes.use('/auth', authRouter);
routes.use('/users', userRouter);
routes.use('/properties', propertyRouter);

export default routes;
