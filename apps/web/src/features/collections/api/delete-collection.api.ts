import { api } from "@/lib/axios";

import type { ApiResponse } from "@/types/api.type";

type DeleteCollectionApiParams = {
  workspaceId: string;
  collectionId: string;
};

export async function deleteCollectionApi({
  workspaceId,
  collectionId,
}: DeleteCollectionApiParams): Promise<void> {
  await api.delete<unknown, ApiResponse<null>>(
    `/workspaces/${workspaceId}/collections/${collectionId}`,
  );
}