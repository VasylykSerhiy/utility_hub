import { json, raw, text, urlencoded } from 'body-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import * as mongoose from 'mongoose';
import morgan from 'morgan';

import { ClientError } from './models/errors';
import { errorResponseHandler } from './responses';
import routes from './routes';

require('dotenv').config({ path: '.env.development.local', override: true });

const app: express.Express = express();

app.use(morgan('tiny'));

app.use(json({ limit: '100mb' }));
app.use(raw());
app.use(text());
app.use(urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000'],
  }),
);

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
