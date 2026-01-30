import type {
  GetPropertyMonth,
  GetPropertyMonths,
  GetPropertyTariffs,
  IMetrics,
  IMonth,
  IProperty,
  IPropertyMonths,
  IPropertyTariff,
  ITariff,
} from '@workspace/types';
import type { CreatePropertySchema, MonthSchema, UpdatePropertySchema } from '@workspace/utils';

import { API, apiAuth } from '@/lib/axios';

export const propertyService = {
  getProperties: async () => apiAuth.get<IProperty[]>(API.PROPERTIES),
  getProperty: async (id: string) => apiAuth.get<IProperty>(`${API.PROPERTIES}/${id}`),
  getPropertyMonths: async ({ id, page, pageSize }: GetPropertyMonths) =>
    apiAuth.get<IPropertyMonths>(
      `${API.PROPERTIES}/${id}/months?page=${page}&pageSize=${pageSize}`,
    ),
  getPropertyMonth: async ({ propertyId, monthId }: GetPropertyMonth) =>
    apiAuth.get<IMonth>(`${API.PROPERTIES}/${propertyId}/months/${monthId}`),
  deletePropertyMonth: async ({ propertyId, monthId }: GetPropertyMonth) =>
    apiAuth.delete<IMonth>(`${API.PROPERTIES}/${propertyId}/months/${monthId}`),
  createProperty: async (data: CreatePropertySchema) => apiAuth.post(API.PROPERTIES, data),
  deleteProperty: async (id: string) => apiAuth.delete(`${API.PROPERTIES}/${id}`),
  updateProperty: async ({ id, data }: { id: string; data: UpdatePropertySchema }) =>
    apiAuth.put(`${API.PROPERTIES}/${id}`, data),
  createMeter: async ({ id, data }: { id: string; data: MonthSchema }) =>
    apiAuth.post(`${API.PROPERTIES}/${id}/months`, data),
  updateMeter: async ({ id, meterId, data }: { id: string; meterId: string; data: MonthSchema }) =>
    apiAuth.put(`${API.PROPERTIES}/${id}/months/${meterId}`, data),
  getPropertyLastTariff: async ({ id }: { id: string }) =>
    apiAuth.get<ITariff>(`${API.PROPERTIES}/${id}/last-tariff`),
  getPropertyTariffs: async ({ id, page, pageSize }: GetPropertyTariffs) =>
    apiAuth.get<IPropertyTariff>(
      `${API.PROPERTIES}/${id}/tariffs?page=${page}&pageSize=${pageSize}`,
    ),
  getPropertyMetrics: async (id: string) =>
    apiAuth.get<IMetrics[]>(`${API.PROPERTIES}/${id}/metrics`),
};
