import {
  DoubleElectricityMeter,
  SingleElectricityMeter,
} from './electricity.types';
import { IMonth } from './month.types';
import { PaginateOptions, PaginatedResult } from './pagination';

export interface IPropertySingleElectricity {
  id: string;
  userId: string;
  name: string;
  electricityType: SingleElectricityMeter['type'];
  lastMonth: IMonth<SingleElectricityMeter>;
  createdAt: string;
  updatedAt: string;
}

export interface IPropertyDoubleElectricity {
  id: string;
  userId: string;
  name: string;
  electricityType: DoubleElectricityMeter['type'];
  lastMonth: IMonth<DoubleElectricityMeter>;
  createdAt: string;
  updatedAt: string;
}

export type IProperty = IPropertySingleElectricity | IPropertyDoubleElectricity;

export type IPropertyWithLastMonth =
  | (IPropertySingleElectricity & {
      lastMonth?: IMonth<SingleElectricityMeter>;
    })
  | (IPropertyDoubleElectricity & {
      lastMonth?: IMonth<DoubleElectricityMeter>;
    });

export interface IPropertyMonths extends PaginatedResult<IMonth> {}

export interface GetPropertyMonths extends PaginateOptions {
  id: string;
}
