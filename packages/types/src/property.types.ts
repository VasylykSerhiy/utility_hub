import type { PaginatedResult, PaginateOptions } from './pagination';
import type { ITariff } from './tariff.type';

export enum IElectricityType {
  SINGLE = 'single',
  DOUBLE = 'double',
}

export interface IElectricity {
  day?: number;
  night?: number;
  single?: number;
}

export interface IMeter {
  electricity: IElectricity;
  water: number;
  gas: number;
}

export interface IMonth {
  id?: string;
  createdAt?: string;
  propertyId: string;
  date: Date;
  meters: IMeter;
  prevMeters: IMeter;
  difference: IMeter;
  tariff: ITariff;
  total: number;
  electricityType: IElectricityType;
}

export interface LastReading {
  electricityType: IElectricityType;
  createdAt: string;
  date: string;
  id: string;
  meters: IMeter;
  prevMeters: IMeter;
  difference: IMeter;
  tariff: ITariff;
  total: number;
}

export type IProperty = {
  created_at: string;
  electricityType: IElectricityType;
  id: string;
  name: string;
  updated_at: string;
  user_id: string;
  lastReading: LastReading;
  currentTariff: ITariff;
};

export interface IMetrics extends IMonth {
  electricityType: IElectricityType;
}

export interface IPropertyMonths extends PaginatedResult<IMonth> {}
export interface IPropertyTariff extends PaginatedResult<ITariff> {}

export interface GetPropertyMonths extends PaginateOptions {
  id: string;
}

export interface GetPropertyMonth {
  propertyId: string;
  monthId: string;
}

export interface GetPropertyTariffs extends PaginateOptions {
  id: string;
}
