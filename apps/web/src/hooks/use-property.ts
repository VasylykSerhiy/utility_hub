import { queryKeys } from '@/constants/query-key';
import { propertyService } from '@/services/property.service';
import { useQuery } from '@tanstack/react-query';

export const getProperties = () => {
  return useQuery({
    queryKey: [queryKeys.property],
    queryFn: propertyService.getProperties,
    select: ({ data }) => data,
  });
};
