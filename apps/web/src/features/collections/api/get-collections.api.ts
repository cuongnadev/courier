import { api } from '@/lib/axios';
import type { CollectionResponse } from '@/features/collections/types/collection.type';

export async function getCollections(workspaceId: string) {
  const response = await api.get<CollectionResponse[]>(
    `/workspaces/${workspaceId}/collections`,
  );

  return response.data;
}