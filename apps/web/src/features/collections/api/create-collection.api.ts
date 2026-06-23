import { api } from "@/lib/axios";

import type { ApiResponse } from "@/types";
import type { CollectionResponse } from "@/features/collections/types";
import type { CreateCollectionFormValues } from "@/features/collections/schemas";

export async function createCollectionApi(
  workspaceId: string,
  data: CreateCollectionFormValues,
): Promise<CollectionResponse> {
  const body = await api.post<unknown, ApiResponse<CollectionResponse>>(
    `/workspaces/${workspaceId}/collections`,
    data,
  );

  return body.data;
}