import { api } from "@/lib/axios";

import type {
  DashboardMetrics,
} from "@/features/dashboard/types";
import type { ProfileActivityMetrics } from "@/features/profile/types";
import type { ApiResponse } from "@/types";

export const getDashboardMetrics = async (
  workspaceId: string,
): Promise<DashboardMetrics> => {
  const body = await api.get<unknown, ApiResponse<DashboardMetrics>>(
    `/workspaces/${workspaceId}/dashboard/metrics`,
  );

  return body.data;
};

export const getProfileActivityMetrics = async (
  workspaceId: string,
): Promise<ProfileActivityMetrics> => {
  const body = await api.get<unknown, ApiResponse<ProfileActivityMetrics>>(
    `/workspaces/${workspaceId}/dashboard/profile-activity`,
  );

  return body.data;
};
