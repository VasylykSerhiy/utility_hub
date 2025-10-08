import { Schema } from 'mongoose';

export const ElectricitySchema = new Schema(
  {
    type: { type: String, enum: ['single', 'double'], required: true },
    single: { type: Number },
    day: { type: Number },
    night: { type: Number },
  },
  { _id: false, versionKey: false },
);
