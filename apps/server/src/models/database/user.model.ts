import mongoose, { model } from 'mongoose';

import { IMongooseUser } from '../../types';

const userSchema = new mongoose.Schema<IMongooseUser>(
  {
    supabaseId: { type: String, unique: true },
    email: String,
    createdAt: Date,
  },
  { versionKey: 'false' },
);

userSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});

export default model('User', userSchema);
