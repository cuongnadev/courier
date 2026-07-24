import type {
  CollectionDetailResponse,
} from "@/features/collections/types";

import type { SearchItem } from "@/features/search/types";

export function normalizeSearchItems(
  collections: CollectionDetailResponse[],
): SearchItem[] {
  return collections.flatMap((collection) => {
    const collectionItem: SearchItem = {
      id: collection.id,

      type: "collection",

      title: collection.name,

      subtitle:
        `${collection.requestsCount} request${collection.requestsCount === 1 ? "" : "s"}`,
    };

    const requestItems: SearchItem[] = collection.requests.map((request) => ({
      id: request.id,

      type: "request",

      title: request.name,

      subtitle: collection.name,

      collectionId: collection.id,

      collectionName: collection.name,

      method: request.method,
    }));

    return [collectionItem, ...requestItems];
  });
}