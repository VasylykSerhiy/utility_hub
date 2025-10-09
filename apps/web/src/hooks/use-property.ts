import { mutationKey, queryKeys } from '@/constants/query-key';
import { propertyService } from '@/services/property.service';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  CreatePropertySchema,
  UpdatePropertySchema,
  queryClient,
} from '@workspace/utils';

export const getProperties = () => {
  return useQuery({
    queryKey: [queryKeys.property],
    queryFn: propertyService.getProperties,
    select: ({ data }) => data,
  });
};

export const useProperty = (type: 'create' | 'edit') => {
  return useMutation({
    mutationKey: [mutationKey.property_create],
    mutationFn: (data: CreatePropertySchema | UpdatePropertySchema) =>
      type === 'create'
        ? propertyService.createProperty(data as CreatePropertySchema)
        : propertyService.updateProperty(data as UpdatePropertySchema),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });
};
