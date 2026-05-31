import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api.type";

import type { CollectionDetailResponse } from "@/features/collections/types";

export async function getCollections(
  workspaceId: string,
): Promise<CollectionDetailResponse[]> {
  const body = await api.get<unknown, ApiResponse<CollectionDetailResponse[]>>(
    `/workspaces/${workspaceId}/collections`,
  );

  console.log(body);
  

  return body.data;
}