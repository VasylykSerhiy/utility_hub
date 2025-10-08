import { ElectricityMeters } from './electricity.types';
import { IFixedCosts, ITariffs } from './property.types';

export interface IMeters {
  electricity: ElectricityMeters;
  water: number;
  gas: number;
}

export interface IDifference {
  electricity: ElectricityMeters;
  water: number;
  gas: number;
}

export interface IMonth {
  _id?: string;
  propertyId: string;
  date: Date;
  meters: IMeters;
  difference: IDifference;
  tariffs: ITariffs;
  fixedCosts: IFixedCosts;
  total: number;
}
