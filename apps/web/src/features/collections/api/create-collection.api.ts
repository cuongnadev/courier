import { api } from "@/lib/axios";
import type { CreateCollectionFormValues } from "@/features/collections/schemas/create-collection.schema";
import type { CollectionResponse } from "@/features/collections/types/collection.type";

export async function createCollectionApi(
  workspaceId: string,
  data: CreateCollectionFormValues,
) {
  const response = await api.post<CollectionResponse>(
    `/workspaces/${workspaceId}/collections`,
    data,
  );

  return response.data;
}