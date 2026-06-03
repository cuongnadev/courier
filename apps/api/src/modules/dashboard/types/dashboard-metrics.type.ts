export interface DashboardMetrics {
  success_requests_today: number;
  total_requests: number;
  collections_count: number;
  active_flows_count: number;
  team_members: number;
  recent_requests: any[];
  latest_collections: any[];
  active_flows: any[];
}

export interface ProfileActivityDay {
  date: string;
  runs: number;
  successfulRuns: number;
  failedRuns: number;
  durationTotalMs: number;
  responseSizeTotal: number;
  averageDurationMs: number;
}

export interface ProfileActivityMetrics {
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  successRate: number;
  averageDurationMs: number;
  totalResponseSize: number;
  activeDays: number;
  days: ProfileActivityDay[];
}
