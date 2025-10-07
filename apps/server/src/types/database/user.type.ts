import { IUser } from '@workspace/types';
import { Document } from 'mongoose';

export interface IMongooseUser extends Document, IUser {}
