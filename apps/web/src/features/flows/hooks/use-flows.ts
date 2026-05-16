import { useQuery } from '@tanstack/react-query';

import { getFlowsApi } from '@/features/flows/api/get-flows.api';

export function useFlows(workspaceId?: string) {
  return useQuery({
    queryKey: ['flows', workspaceId],

    queryFn: () => getFlowsApi(workspaceId!),

    enabled: Boolean(workspaceId),
  });
}