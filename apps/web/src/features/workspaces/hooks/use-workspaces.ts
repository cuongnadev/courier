import { useQuery } from '@tanstack/react-query';

import { getWorkspacesApi } from '@/features/workspaces/api/get-workspaces.api';

export function useWorkspaces() {
  return useQuery({
    queryKey: ['workspaces'],
    queryFn: getWorkspacesApi,
  });
}