import mongoose from 'mongoose';

import { applyIdVirtual } from '../../utils';

const propertySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String, required: true },
    electricityType: {
      type: String,
      enum: ['single', 'double'],
      required: true,
    },
  },
  {
    versionKey: 'false',
    timestamps: true,
  },
);

applyIdVirtual(propertySchema);
export default mongoose.model('Property', propertySchema);
