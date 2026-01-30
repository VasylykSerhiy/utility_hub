import type { FullDashboardData } from '@workspace/types';

import { API, apiAuth } from '@/lib/axios';

export const dashboardService = {
  getDashboardAnalytics: async () =>
    apiAuth.get<FullDashboardData>(API.DASHBOARD),
};
