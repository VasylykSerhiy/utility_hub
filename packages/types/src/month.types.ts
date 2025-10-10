import { ElectricityMeters } from './electricity.types';

export interface IMeter<T extends ElectricityMeters = ElectricityMeters> {
  electricity: T;
  water: number;
  gas: number;
}

export interface IMonth<T extends ElectricityMeters = ElectricityMeters> {
  id?: string;
  propertyId: string;
  date: Date;
  meters: IMeter<T>;
}
