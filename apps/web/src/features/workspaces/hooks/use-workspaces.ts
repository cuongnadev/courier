import { useQuery } from '@tanstack/react-query';

import { useAuthStore } from '@/features/auth/store/auth.store';
import { getWorkspacesApi } from '@/features/workspaces/api/get-workspaces.api';

export function useWorkspaces() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ['workspaces'],
    queryFn: getWorkspacesApi,
    enabled: Boolean(accessToken),
    retry: false,
  });
}