import cors from 'cors';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import * as mongoose from 'mongoose';
import morgan from 'morgan';

import { ClientError } from './models/errors';
import { errorResponseHandler } from './responses';
import routes from './routes';

dotenv.config({
  path: '.env.development.local',
});

const app: express.Express = express();

app.use(morgan('tiny'));

app.use(express.json({ limit: '100mb' }));
app.use(express.raw());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

app.use(cors());

app.use('/v1', routes);

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof ClientError) {
    res
      .status(error.status || 400)
      .json(errorResponseHandler.getClientErrorResponse(error));

    return;
  }

  res.status(500).json(errorResponseHandler.getServerErrorResponse(error));
});

export default app;
