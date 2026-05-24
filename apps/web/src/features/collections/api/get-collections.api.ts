import { api } from '@/lib/axios';
import type { CollectionRequest } from '@/features/collections/types/collection.type';

export async function getCollections(workspaceId: string) {
  const response = await api.get<CollectionRequest[]>(
    `/workspaces/${workspaceId}/collections`,
  );

  return response.data;
}