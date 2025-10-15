import { API, apiAuth } from '@/lib/axios';
import {
  GetPropertyMonths,
  GetPropertyTariffs,
  IMonth,
  IPropertyMonths,
  IPropertyTariff,
  IPropertyWithLastMonth,
  ITariff,
} from '@workspace/types';
import {
  CreatePropertySchema,
  MonthSchema,
  UpdatePropertySchema,
} from '@workspace/utils';

export const propertyService = {
  getProperties: async () =>
    apiAuth.get<IPropertyWithLastMonth[]>(API.PROPERTIES),
  getProperty: async (id: string) =>
    apiAuth.get<IPropertyWithLastMonth>(`${API.PROPERTIES}/${id}`),
  getPropertyMonths: async ({ id, page, pageSize }: GetPropertyMonths) =>
    apiAuth.get<IPropertyMonths>(
      `${API.PROPERTIES}/${id}/months?page=${page}&pageSize=${pageSize}`,
    ),
  createProperty: async (data: CreatePropertySchema) =>
    apiAuth.post(API.PROPERTIES, data),
  updateProperty: async ({
    id,
    data,
  }: {
    id: string;
    data: UpdatePropertySchema;
  }) => apiAuth.put(`${API.PROPERTIES}/${id}`, data),
  createMeter: async ({ id, data }: { id: string; data: MonthSchema }) =>
    apiAuth.post(`${API.PROPERTIES}/${id}/months`, data),
  getPropertyLastTariff: async ({ id }: { id: string }) =>
    apiAuth.get<ITariff>(`${API.PROPERTIES}/${id}/last-tariff`),
  getPropertyTariffs: async ({ id, page, pageSize }: GetPropertyTariffs) =>
    apiAuth.get<IPropertyTariff>(
      `${API.PROPERTIES}/${id}/tariffs?page=${page}&pageSize=${pageSize}`,
    ),
  getPropertyMetrics: async (id: string) =>
    apiAuth.get<IMonth[]>(`${API.PROPERTIES}/${id}/metrics`),
};
