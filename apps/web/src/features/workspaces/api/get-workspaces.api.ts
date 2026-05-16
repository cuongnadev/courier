import { api } from '@/lib/axios';

import type { WorkspaceResponse } from '@/features/workspaces/types/workspace.type';

export async function getWorkspacesApi() {
  const response = await api.get<WorkspaceResponse[]>(
    '/workspaces',
  );
  
  return response.data;
}