import { IMongooseUser } from './database';

declare global {
  namespace Express {
    interface Request {
      user?: IMongooseUser;
    }
  }
}
