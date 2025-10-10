import { API, apiAuth } from '@/lib/axios';
import { IPropertyWithLastMonth } from '@workspace/types';
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
  createProperty: async (data: CreatePropertySchema) =>
    apiAuth.post(API.PROPERTIES, data),
  updateProperty: async (data: UpdatePropertySchema) =>
    apiAuth.put(API.PROPERTIES, data),
  createMeter: async ({ id, data }: { id: string; data: MonthSchema }) =>
    apiAuth.post(`${API.PROPERTIES}/${id}/months`, data),
};
