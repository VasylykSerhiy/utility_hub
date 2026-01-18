export interface MonthTrend {
  month: Date;
  total: number;
}

export interface PropertyCost {
  name: string;
  total: number;
}

export interface CategoryBreakdown {
  water: number;
  gas: number;
  electricity: number;
  fixed: number;
}

export interface FullDashboardData {
  currentMonthName: string;
  totalSpentCurrentMonth: number;
  totalSpentLastMonth: number;
  pendingReadingsCount: number;
  activeProperties: number;
  spendingBreakdown: CategoryBreakdown;
  costByProperty: PropertyCost[];
  sixMonthTrend: MonthTrend[];
}
