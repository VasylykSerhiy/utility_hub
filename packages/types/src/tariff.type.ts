import { Types } from 'mongoose';

import { ElectricityMeters } from './electricity.types';
import { IMeter } from './month.types';

export interface IFixedCosts {
  internet: number;
  maintenance: number;
  gas_delivery: number;
}

export interface ITariff<T extends ElectricityMeters = ElectricityMeters> {
  propertyId: Types.ObjectId | string;
  startDate: Date;
  endDate?: Date;
  tariffs: IMeter<T>;
  fixedCosts: IFixedCosts;
  id: string;
}
