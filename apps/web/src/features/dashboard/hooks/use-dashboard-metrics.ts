import { useQuery } from "@tanstack/react-query";
import { getDashboardMetrics } from "@/features/dashboard/api/dashboard.api";

export const useDashboardMetrics = (workspaceId: string | undefined) => {
  return useQuery({
    queryKey: ["dashboard-metrics", workspaceId],
    queryFn: () => getDashboardMetrics(workspaceId!),
    enabled: !!workspaceId,
  });
};