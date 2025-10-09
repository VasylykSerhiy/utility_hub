import {
  DoubleElectricityMeter,
  ElectricityMeters,
  SingleElectricityMeter,
} from './electricity.types';
import { IMonth } from './month.types';

export interface ITariffs<T extends ElectricityMeters = ElectricityMeters> {
  electricity: T;
  water: number;
  gas: number;
}

export interface IFixedCosts {
  internet: number;
  maintenance: number;
  gas_delivery: number;
}

export interface IPropertySingleElectricity {
  id: string;
  userId: string;
  name: string;
  electricityType: SingleElectricityMeter['type'];
  tariffs: ITariffs<SingleElectricityMeter>;
  fixedCosts: IFixedCosts;
  createdAt: string;
  updatedAt: string;
}

export interface IPropertyDoubleElectricity {
  id: string;
  userId: string;
  name: string;
  electricityType: DoubleElectricityMeter['type'];
  tariffs: ITariffs<DoubleElectricityMeter>;
  fixedCosts: IFixedCosts;
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
