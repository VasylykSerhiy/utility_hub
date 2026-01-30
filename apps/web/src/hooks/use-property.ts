import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import type {
  GetPropertyMonth,
  GetPropertyMonths,
  GetPropertyTariffs,
} from '@workspace/types';
import type {
  CreatePropertySchema,
  UpdatePropertySchema,
} from '@workspace/utils';

import { propertyService } from '@/services/property.service';
import { mutationKey, queryKeys } from '@/constants/query-key';

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

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: propertyService.deleteProperty,
    onSuccess: async (_, deletedId) => {
      await queryClient.cancelQueries({
        queryKey: [queryKeys.property, deletedId],
      });

      await queryClient.invalidateQueries({
        queryKey: [queryKeys.property],
        exact: true,
        refetchType: 'active',
      });
    },
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

export const getPropertyMonth = ({ propertyId, monthId }: GetPropertyMonth) => {
  return useQuery({
    queryKey: [queryKeys.months, propertyId, monthId],
    queryFn: () => propertyService.getPropertyMonth({ propertyId, monthId }),
    select: ({ data }) => data,
    enabled: !!propertyId && !!monthId,
    placeholderData: keepPreviousData,
  });
};

export const useDeletePropertyMonth = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: GetPropertyMonth) =>
      propertyService.deletePropertyMonth(data),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: [queryKeys.property],
        exact: true,
      });
      void queryClient.invalidateQueries({
        queryKey: [queryKeys.property, variables.propertyId],
        exact: true,
      });
      void queryClient.invalidateQueries({ queryKey: [queryKeys.months] });
    },
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
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.property, variables.id],
      });

      void queryClient.invalidateQueries({ queryKey: [queryKeys.tariff] });
      void queryClient.invalidateQueries({
        queryKey: [queryKeys.property],
        exact: true,
      });
    },
  });
};

export const useCreateMeter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [mutationKey.meter_create],
    mutationFn: propertyService.createMeter,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [queryKeys.property],
        exact: true,
      });
      void queryClient.invalidateQueries({ queryKey: [queryKeys.months] });
    },
  });
};

export const useUpdateMeter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [mutationKey.meter_update],
    mutationFn: propertyService.updateMeter,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [queryKeys.property],
        exact: true,
      });
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
