import { ElectricityMeters } from './electricity.types';
import { IMonth } from './month.types';

export interface ITariffs {
  electricity: ElectricityMeters;
  water: number;
  gas: number;
}

export interface IFixedCosts {
  internet: number;
  maintenance: number;
  gas_delivery: number;
}

export interface IProperty {
  _id?: string;
  userId: string;
  name: string;
  tariffs: ITariffs;
  fixedCosts: IFixedCosts;
}

export interface IPropertyWithLastMonth extends IProperty {
  lastMonth: IMonth;
}
