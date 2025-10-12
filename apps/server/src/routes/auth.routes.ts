import { Router } from 'express';

import { authSchema } from '@workspace/utils/schemas/auth';

import { authorizationController } from '../controllers';
import { validateRequest } from '../utils/validation.util';

const authRouter = Router();

authRouter.post('/', validateRequest(authSchema), authorizationController.auth);

export default authRouter;
