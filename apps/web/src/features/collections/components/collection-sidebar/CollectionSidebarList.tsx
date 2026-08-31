import type { CollectionResponse } from "@/features/collections/types";

import { CollectionSidebarItem } from "@/features/collections/components/collection-sidebar";

type CollectionSidebarListProps = {
  searchQuery?: string;

  collections: CollectionResponse[];

  activeCollectionId?: string;

  onSelectCollection?: (
    collectionId: string,
  ) => void;
  onEditCollection?: (collection: CollectionResponse) => void;
  onDeleteCollection?: (collection: CollectionResponse) => void;
};

export function CollectionSidebarList({
  searchQuery = "",
  collections,
  activeCollectionId,
  onSelectCollection,
  onEditCollection,
  onDeleteCollection
}: CollectionSidebarListProps) {
  return (
    <div className="space-y-1 w-full">
      {collections.map((collection) => (
        <CollectionSidebarItem
          key={collection.id}
          searchQuery={searchQuery}
          collection={collection}
          isActive={
            collection.id ===
            activeCollectionId
          }
          onClick={() =>
            onSelectCollection?.(
              String(collection.id),
            )
          }
          onEditCollection={onEditCollection}
          onDeleteCollection={onDeleteCollection}
        />
      ))}
    </div>
  );
}