import { api } from "@/lib/axios";
import type { CollectionDetailResponse } from "@/features/collections/types/collection.type";
import type { ApiResponse } from "@/types/api.type";

export async function getCollections(
  workspaceId: string,
): Promise<CollectionDetailResponse[]> {
  const body = await api.get<unknown, ApiResponse<CollectionDetailResponse[]>>(
    `/workspaces/${workspaceId}/collections`,
  );

  return body.data;
}