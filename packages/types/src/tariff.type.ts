import type { IMeter } from './property.types';

export interface IFixedCosts {
  internet: number;
  maintenance: number;
  gas_delivery: number;
}

export interface ITariff {
  startDate: Date;
  endDate?: Date;
  tariffs: IMeter;
  fixedCosts: IFixedCosts;
  id: string;
}
