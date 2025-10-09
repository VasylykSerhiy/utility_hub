import { API, apiAuth } from '@/lib/axios';
import { IPropertyWithLastMonth } from '@workspace/types';
import { CreatePropertySchema, UpdatePropertySchema } from '@workspace/utils';

export const propertyService = {
  getProperties: async () =>
    apiAuth.get<IPropertyWithLastMonth[]>(API.PROPERTIES),
  createProperty: async (data: CreatePropertySchema) =>
    apiAuth.post(API.PROPERTIES, data),
  updateProperty: async (data: UpdatePropertySchema) =>
    apiAuth.put(API.PROPERTIES, data),
};
