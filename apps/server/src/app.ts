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

app.use(express.json({ limit: '1mb' }));

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(
  allowedOrigins?.length
    ? cors({ origin: allowedOrigins })
    : cors(),
);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/v1', routes);

app.use((_req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof ClientError) {
    res.status(error.status || 400).json(errorResponseHandler.getClientErrorResponse(error));
    return;
  }

  console.error('Unhandled error:', error);
  res.status(500).json(errorResponseHandler.getServerErrorResponse(error));
});

export default app;
