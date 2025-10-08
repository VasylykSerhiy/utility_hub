export interface singleElectricityMeter {
  type: 'single';
  single: number;
}

export interface doubleElectricityMeter {
  type: 'double';
  day: number;
  night: number;
}

export type ElectricityMeters = singleElectricityMeter | doubleElectricityMeter;
