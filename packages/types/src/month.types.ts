import { IFixedCosts, ITariffs } from './property.types';

export interface IMeters {
  electricityDay: number;
  electricityNight: number;
  water: number;
  gas: number;
}

export interface IDifference {
  electricityDay: number;
  electricityNight: number;
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
