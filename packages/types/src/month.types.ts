import { ElectricityMeters } from './electricity.types';
import { ITariff } from './tariff.type';

export interface IMeter<T extends ElectricityMeters = ElectricityMeters> {
  electricity: T;
  water: number;
  gas: number;
}

export interface IMonth<T extends ElectricityMeters = ElectricityMeters> {
  id?: string;
  createdAt?: string;
  propertyId: string;
  date: Date;
  meters: IMeter<T>;
  prevMeters: IMeter<T>;
  difference: IMeter<T>;
  tariff: ITariff<T>;
  total: number;
}
