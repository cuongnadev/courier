import { api } from "@/lib/axios";

import type { ApiResponse } from "@/types";
import type { CollectionDetailResponse, ImportCollectionPayload } from "@/features/collections/types";

export type ImportCollectionApiPayload = {
  workspaceId: string;
  data: ImportCollectionPayload;
};

export async function importCollectionApi({
  workspaceId,
  data,
}: ImportCollectionApiPayload): Promise<CollectionDetailResponse> {
  const body = await api.post<unknown, ApiResponse<CollectionDetailResponse>>(
    `/workspaces/${workspaceId}/collections/import`,
    data,
  );

  return body.data;
}