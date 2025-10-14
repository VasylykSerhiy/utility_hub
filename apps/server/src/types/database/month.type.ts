import mongoose from 'mongoose';

export interface MonthDocument extends mongoose.Document {
  propertyId: mongoose.Types.ObjectId;
  date: Date;
  meters?: {
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
