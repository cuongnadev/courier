import { api } from "@/lib/axios";

import type { ApiResponse } from "@/types/api.type";
import type {
  CollectionResponse,
  CollectionColor,
} from "@/features/collections/types/collection.type";

export type UpdateCollectionPayload = {
  name?: string;
  description?: string | null;
  color?: CollectionColor;
  sortOrder?: number;
};

type UpdateCollectionApiParams = {
  workspaceId: string;
  collectionId: string;
  data: UpdateCollectionPayload;
};

export async function updateCollectionApi({
  workspaceId,
  collectionId,
  data,
}: UpdateCollectionApiParams): Promise<CollectionResponse> {
  const body = await api.patch<unknown, ApiResponse<CollectionResponse>>(
    `/workspaces/${workspaceId}/collections/${collectionId}`,
    data,
  );

  return body.data;
}