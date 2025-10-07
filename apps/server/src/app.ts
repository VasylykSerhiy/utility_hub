import cors from 'cors';
import express from 'express';
import * as mongoose from 'mongoose';
import morgan from 'morgan';

import routes from './routes';

require('dotenv').config({ path: '.env.development.local', override: true });

const app: express.Express = express();

app.use(morgan('tiny'));

app.use(express.json({ limit: '100mb' }));

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

export default app;
