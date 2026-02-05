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

/** UA: Опційні поля заміни лічильника (baseline / old final). EN: Optional meter replacement fields. */
export interface IReplacement {
  electricity?: {
    baselineSingle?: number;
    baselineDay?: number;
    baselineNight?: number;
    oldFinalSingle?: number;
    oldFinalDay?: number;
    oldFinalNight?: number;
  };
  water?: { baseline?: number; oldFinal?: number };
  gas?: { baseline?: number; oldFinal?: number };
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
  replacement?: IReplacement | null;
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
  role?: PropertyRole;
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

/** UA: owner = власник об'єкта, admin = запрошений з повним доступом, viewer = лише перегляд. EN: owner = property owner, admin = invited full access, viewer = read-only. */
export type PropertyRole = 'owner' | 'admin' | 'viewer';

export interface IPropertyMember {
  id: string;
  propertyId: string;
  userId: string;
  role: PropertyRole;
  createdAt: string;
  email?: string;
}

/** UA: Один запис журналу аудиту по об'єкту. EN: Single property audit log entry. */
export interface IAuditLogEntry {
  id: string;
  propertyId: string;
  userId: string;
  action: string;
  entityType: string | null;
  entityId: string | null;
  details: Record<string, unknown>;
  createdAt: string;
}

export interface IPropertyAuditLog extends PaginatedResult<IAuditLogEntry> {}
