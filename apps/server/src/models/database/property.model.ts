import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    tariffs: {
      electricityDay: { type: Number, default: 0 },
      electricityNight: { type: Number, default: 0 },
      water: { type: Number, default: 0 },
      gas: { type: Number, default: 0 },
    },
    fixedCosts: {
      internet: { type: Number, default: 0 },
      maintenance: { type: Number, default: 0 },
    },
  },
  { versionKey: 'false', timestamps: true },
);

export default mongoose.model('Property', propertySchema);
