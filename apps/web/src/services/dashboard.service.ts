import { API, apiAuth } from '@/lib/axios';
import { FullDashboardData } from '@workspace/types';

export const dashboardService = {
  getDashboardAnalytics: async () =>
    apiAuth.get<FullDashboardData>(API.DASHBOARD),
};
