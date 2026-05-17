import type { CollectionResponse } from "@/features/collections/types/collection.type";
import { getStableVariant } from "./get-stable-variant";

export function mapCollectionResponseToCollection(
  collection: Omit<CollectionResponse, "variant">,
): CollectionResponse {
  return {
    id: collection.id,
    name: collection.name,
    variant: getStableVariant(collection.id),
    requests: collection.requests,
  };
}