import {
  DoubleElectricityMeter,
  ElectricityMeterType,
  IMonth,
  SingleElectricityMeter,
} from '@workspace/types';

export const isSingleMonth = (
  month: IMonth,
): month is IMonth<SingleElectricityMeter> => {
  return month.meters.electricity.type === ElectricityMeterType.SINGLE;
};

export const isDoubleMonth = (
  month: IMonth,
): month is IMonth<DoubleElectricityMeter> => {
  return month.meters.electricity.type === ElectricityMeterType.DOUBLE;
};
