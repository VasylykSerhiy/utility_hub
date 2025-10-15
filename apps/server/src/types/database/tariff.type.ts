import mongoose from 'mongoose';

export interface TariffDocument extends mongoose.Document {
  propertyId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  tariffs?: {
    electricity?: {
      type: 'single' | 'double';
      single?: number;
      day?: number;
      night?: number;
    };
    water?: number;
    gas?: number;
  };
  fixedCosts?: {
    electricity?: {
      type: 'single' | 'double';
      single?: number;
      day?: number;
      night?: number;
    };
    water?: number;
    gas?: number;
  };
}
