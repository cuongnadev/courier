import { api } from "@/lib/axios";
import type { DashboardMetrics } from "@/features/dashboard/types/dashboard.type";
import type { ApiResponse } from "@/types/api.type";

export const getDashboardMetrics = async (
  workspaceId: string,
): Promise<DashboardMetrics> => {
  const body = await api.get<unknown, ApiResponse<DashboardMetrics>>(
    `/workspaces/${workspaceId}/dashboard/metrics`,
  );

  return body.data;
};