import mongoose, { model } from 'mongoose';

import { IMongooseUser } from '../../types';
import { applyIdVirtual } from '../../utils';

const userSchema = new mongoose.Schema<IMongooseUser>(
  {
    supabaseId: { type: String, unique: true },
    email: String,
  },
  {
    versionKey: 'false',
    timestamps: true,
  },
);

applyIdVirtual(userSchema);

export default model('User', userSchema);
