import { IElectricityType } from '@workspace/types';

export const isSingleElectricity = (type: IElectricityType) => {
  return type === IElectricityType.SINGLE;
};

export const isDoubleElectricity = (type: IElectricityType) => {
  return type === IElectricityType.DOUBLE;
};
