import { api } from '@/lib/axios';
import type { FlowResponse } from '@/features/flows/types/flow.type';

export async function getFlowsApi(workspaceId: string) {
  const response = await api.get<FlowResponse[]>(
    `/workspaces/${workspaceId}/flows`,
  );

  return response.data;
}