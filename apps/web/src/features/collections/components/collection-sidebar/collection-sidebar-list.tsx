import type { CollectionRequest } from "@/features/collections/types/collection.type";
import { CollectionSidebarItem } from "./collection-sidebar-item";

type CollectionSidebarListProps = {
  collections: CollectionRequest[];

  activeCollectionId?: string;

  onSelectCollection?: (
    collectionId: string,
  ) => void;
};

export function CollectionSidebarList({
  collections,
  activeCollectionId,
  onSelectCollection,
}: CollectionSidebarListProps) {
  return (
    <div className="space-y-1">
      {collections.map((collection) => (
        <CollectionSidebarItem
          key={collection.id}
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
        />
      ))}
    </div>
  );
}