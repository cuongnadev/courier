export type ProfileActivityDay = {
  date: string;
  runs: number;
  successfulRuns: number;
  failedRuns: number;
  durationTotalMs: number;
  responseSizeTotal: number;
  averageDurationMs: number;
};

export type ProfileActivityMetrics = {
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  successRate: number;
  averageDurationMs: number;
  totalResponseSize: number;
  activeDays: number;
  days: ProfileActivityDay[];
};