import { api } from "@/lib/axios";
import type {
  DashboardMetrics,
  ProfileActivityMetrics,
} from "@/features/dashboard/types/dashboard.type";
import type { ApiResponse } from "@/types/api.type";

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
