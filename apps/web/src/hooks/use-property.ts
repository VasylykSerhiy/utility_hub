import { mutationKey, queryKeys } from '@/constants/query-key';
import { propertyService } from '@/services/property.service';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { GetPropertyMonths, GetPropertyTariffs } from '@workspace/types';
import { CreatePropertySchema, UpdatePropertySchema } from '@workspace/utils';

export const getProperties = () => {
  return useQuery({
    queryKey: [queryKeys.property],
    queryFn: propertyService.getProperties,
    select: ({ data }) => data,
  });
};

export const getProperty = (id: string) => {
  return useQuery({
    queryKey: [queryKeys.property, id],
    queryFn: () => propertyService.getProperty(id),
    select: ({ data }) => data,
    enabled: !!id,
  });
};

export const getPropertyMonths = ({
  id,
  page,
  pageSize,
}: GetPropertyMonths) => {
  return useQuery({
    queryKey: [queryKeys.months, id, page, pageSize],
    queryFn: () => propertyService.getPropertyMonths({ id, page, pageSize }),
    select: ({ data }) => data,
    enabled: !!id,
    placeholderData: keepPreviousData,
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [mutationKey.property_create],
    mutationFn: (data: CreatePropertySchema) =>
      propertyService.createProperty(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [queryKeys.property] }),
  });
};

export const useUpdateTariff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [mutationKey.property_create],
    mutationFn: (props: { id: string; data: UpdatePropertySchema }) =>
      propertyService.updateProperty(props),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [queryKeys.property] });
      void queryClient.invalidateQueries({ queryKey: [queryKeys.tariff] });
    },
  });
};

export const useCreateMeter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [mutationKey.meter_create],
    mutationFn: propertyService.createMeter,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [queryKeys.property] });
      void queryClient.invalidateQueries({ queryKey: [queryKeys.months] });
    },
  });
};

export const getPropertyLastTariff = ({ id }: GetPropertyMonths) => {
  return useQuery({
    queryKey: [queryKeys.tariff, id],
    queryFn: () => propertyService.getPropertyLastTariff({ id }),
    select: ({ data }) => data,
    enabled: !!id,
    placeholderData: keepPreviousData,
  });
};

export const getPropertyTariffs = ({
  id,
  page,
  pageSize,
}: GetPropertyTariffs) => {
  return useQuery({
    queryKey: [queryKeys.tariff, id, page, pageSize],
    queryFn: () => propertyService.getPropertyTariffs({ id, page, pageSize }),
    select: ({ data }) => data,
    enabled: !!id,
    placeholderData: keepPreviousData,
  });
};

export const getPropertyMetrics = (id: string) => {
  return useQuery({
    queryKey: [queryKeys.metrics, id],
    queryFn: () => propertyService.getPropertyMetrics(id),
    select: ({ data }) => data,
    enabled: !!id,
    placeholderData: keepPreviousData,
  });
};
