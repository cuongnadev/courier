import { api } from "@/lib/axios";
import type { FlowResponse } from "@/features/flows/types/flow.type";
import type { ApiResponse } from "@/types/api.type";

export async function getFlowsApi(
  workspaceId: string,
): Promise<FlowResponse[]> {
  const body = await api.get<unknown, ApiResponse<FlowResponse[]>>(
    `/workspaces/${workspaceId}/flows`,
  );

  return body.data;
}