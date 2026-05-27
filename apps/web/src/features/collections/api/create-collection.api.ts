import { api } from "@/lib/axios";
import type { CreateCollectionFormValues } from "@/features/collections/schemas/create-collection.schema";
import type { CollectionResponse } from "@/features/collections/types/collection.type";
import type { ApiResponse } from "@/types/api.type";

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