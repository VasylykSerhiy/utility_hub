import { ITariff } from '@workspace/types';
import { Schema, model } from 'mongoose';

import { ElectricitySchema } from './electricity.model';

const TariffSchema = new Schema<ITariff>(
  {
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    tariffs: {
      electricity: ElectricitySchema,
      water: { type: Number, default: 0 },
      gas: { type: Number, default: 0 },
    },
    fixedCosts: {
      internet: { type: Number, default: 0 },
      maintenance: { type: Number, default: 0 },
      gas_delivery: { type: Number, default: 0 },
    },
  },
  {
    versionKey: 'false',
    timestamps: true,
  },
);

export default model('Tariff', TariffSchema);
