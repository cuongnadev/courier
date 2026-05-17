import { api } from "@/lib/axios";
import type { DashboardMetrics } from "@/features/dashboard/types/dashboard.type";

export const getDashboardMetrics = async (workspaceId: string) => {
  const response = await api.get<DashboardMetrics>(
    `/workspaces/${workspaceId}/dashboard/metrics`
  );

  return response.data;
};