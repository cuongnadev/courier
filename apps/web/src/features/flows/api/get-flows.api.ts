import { api } from "@/lib/axios";

import type { ApiResponse } from "@/types/api.type";

import type { FlowResponse } from "@/features/flows/types";

export async function getFlowsApi(
  workspaceId: string,
): Promise<FlowResponse[]> {
  const body = await api.get<unknown, ApiResponse<FlowResponse[]>>(
    `/workspaces/${workspaceId}/flows`,
  );

  return body.data;
}