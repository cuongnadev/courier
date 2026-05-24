import { api } from '@/lib/axios';
import type { CollectionDetailResponse } from '@/features/collections/types/collection.type';

export async function getCollections(workspaceId: string) {
  const response = await api.get<CollectionDetailResponse[]>(
    `/workspaces/${workspaceId}/collections`,
  );

  return response.data;
}