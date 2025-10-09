import { ElectricityMeters } from './electricity.types';
import { IFixedCosts, ITariffs } from './property.types';

export interface IMeters<T extends ElectricityMeters = ElectricityMeters> {
  electricity: T;
  water: number;
  gas: number;
}

export interface IDifference<T extends ElectricityMeters = ElectricityMeters> {
  electricity: T;
  water: number;
  gas: number;
}

export interface IMonth<T extends ElectricityMeters = ElectricityMeters> {
  id?: string;
  propertyId: string;
  date: Date;
  meters: IMeters<T>;
  difference: IDifference<T>;
  tariffs: ITariffs<T>;
  fixedCosts: IFixedCosts;
  total: number;
}
