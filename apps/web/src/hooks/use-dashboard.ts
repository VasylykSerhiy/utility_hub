import { useQuery } from '@tanstack/react-query';

import { dashboardService } from '@/services/dashboard.service';
import { queryKeys } from '@/constants/query-key';

export const useGetDashboardAnalytics = () => {
  return useQuery({
    queryKey: [queryKeys.dashboard],
    queryFn: dashboardService.getDashboardAnalytics,
    select: ({ data }) => data,
  });
};
