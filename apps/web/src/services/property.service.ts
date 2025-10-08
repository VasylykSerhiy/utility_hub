import { API, apiAuth } from '@/lib/axios';
import { IPropertyWithLastMonth } from '@workspace/types';

export const propertyService = {
  getProperties: async () =>
    apiAuth.get<IPropertyWithLastMonth[]>(API.PROPERTIES),
};
