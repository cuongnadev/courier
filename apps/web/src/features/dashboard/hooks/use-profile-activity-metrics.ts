import { useQuery } from "@tanstack/react-query";

import { getProfileActivityMetrics } from "@/features/dashboard/api/dashboard.api";

export function useProfileActivityMetrics(workspaceId: string | null) {
  return useQuery({
    queryKey: ["profile-activity-metrics", workspaceId],
    queryFn: () => getProfileActivityMetrics(workspaceId!),
    enabled: Boolean(workspaceId),
  });
}
