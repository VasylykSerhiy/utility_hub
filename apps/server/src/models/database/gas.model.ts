import { Schema } from 'mongoose';

export const GasSchema = new Schema(
  {
    delivery: { type: Number, required: true },
    const: { type: Number, default: 0 },
  },
  { _id: false, versionKey: false },
);
