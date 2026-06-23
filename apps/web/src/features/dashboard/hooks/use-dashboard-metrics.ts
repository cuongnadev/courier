import { useQuery } from "@tanstack/react-query";
import { getDashboardMetrics } from "@/features/dashboard/api";

export const useDashboardMetrics = (workspaceId: string | null) => {
  return useQuery({
    queryKey: ["dashboard-metrics", workspaceId],
    queryFn: () => getDashboardMetrics(workspaceId!),
    enabled: !!workspaceId,
  });
};