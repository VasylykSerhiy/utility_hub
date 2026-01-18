import { queryKeys } from '@/constants/query-key';
import { dashboardService } from '@/services/dashboard.service';
import { useQuery } from '@tanstack/react-query';

export const useGetDashboardAnalytics = () => {
  return useQuery({
    queryKey: [queryKeys.dashboard],
    queryFn: dashboardService.getDashboardAnalytics,
    select: ({ data }) => data,
  });
};
