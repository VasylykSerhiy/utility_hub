import mongoose from 'mongoose';

import { ElectricitySchema } from './electricity.model';

const monthSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    date: { type: Date, required: true },
    meters: {
      electricity: { type: ElectricitySchema },
      water: { type: Number, default: 0 },
      gas: { type: Number, default: 0 },
    },
    difference: {
      electricity: { type: ElectricitySchema },
      water: { type: Number, default: 0 },
      gas: { type: Number, default: 0 },
    },
    tariffs: {
      electricity: { type: ElectricitySchema },
      water: { type: Number, default: 0 },
      gas: { type: Number, default: 0 },
    },
    fixedCosts: {
      internet: { type: Number, default: 0 },
      maintenance: { type: Number, default: 0 },
      gas_delivery: { type: Number, default: 0 },
    },
    total: { type: Number, default: 0 },
  },
  { versionKey: 'false', timestamps: true },
);

export default mongoose.model('Month', monthSchema);
