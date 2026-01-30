import cors from 'cors';
import dotenv from 'dotenv';
import express, { type NextFunction, type Request, type Response } from 'express';
import morgan from 'morgan';

import { ClientError } from './models/errors';
import { errorResponseHandler } from './responses';
import routes from './routes';

dotenv.config({
  path: '.env.local',
});

const app: express.Express = express();

app.use(morgan('tiny'));

app.use(express.json({ limit: '100mb' }));
app.use(express.raw());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use('/v1', routes);

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof ClientError) {
    res.status(error.status || 400).json(errorResponseHandler.getClientErrorResponse(error));

    return;
  }

  res.status(500).json(errorResponseHandler.getServerErrorResponse(error));
});

export default app;
