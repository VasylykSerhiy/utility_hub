export enum ElectricityMeterType {
  SINGLE = 'single',
  DOUBLE = 'double',
}

export interface SingleElectricityMeter {
  type: ElectricityMeterType.SINGLE;
  single: number;
}

export interface DoubleElectricityMeter {
  type: ElectricityMeterType.DOUBLE;
  day: number;
  night: number;
}

export type ElectricityMeters = SingleElectricityMeter | DoubleElectricityMeter;
