import {
  DoubleElectricityMeter,
  ElectricityMeterType,
  ElectricityMeters,
  IMonth,
  SingleElectricityMeter,
} from '@workspace/types';

export const isSingleMonth = (
  month: IMonth,
): month is IMonth<SingleElectricityMeter> => {
  return month?.meters?.electricity?.type === ElectricityMeterType.SINGLE;
};

export const isDoubleMonth = (
  month: IMonth,
): month is IMonth<DoubleElectricityMeter> => {
  return month?.meters?.electricity?.type === ElectricityMeterType.DOUBLE;
};

export const isSingleElectricity = (
  electricity: ElectricityMeters,
): electricity is SingleElectricityMeter => {
  return electricity?.type === ElectricityMeterType.SINGLE;
};

export const isDoubleElectricity = (
  electricity: ElectricityMeters,
): electricity is DoubleElectricityMeter => {
  return electricity?.type === ElectricityMeterType.DOUBLE;
};
