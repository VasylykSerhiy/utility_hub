import mongoose from 'mongoose';

const monthSchema = new mongoose.Schema(
  {
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    date: { type: Date, required: true },
    meters: {
      electricityDay: { type: Number, default: 0 },
      electricityNight: { type: Number, default: 0 },
      water: { type: Number, default: 0 },
      gas: { type: Number, default: 0 },
    },
    difference: {
      // різниця від попереднього місяця
      electricityDay: Number,
      electricityNight: Number,
      water: Number,
      gas: Number,
    },
    tariffs: {
      electricityDay: Number,
      electricityNight: Number,
      water: Number,
      gas: Number,
    },
    fixedCosts: {
      internet: Number,
      maintenance: Number,
    },
    total: { type: Number, default: 0 },
  },
  { versionKey: 'false', timestamps: true },
);

export default mongoose.model('Month', monthSchema);
