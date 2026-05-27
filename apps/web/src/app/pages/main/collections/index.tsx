import { useState } from "react";

import { useCollections } from "@/features/collections/hooks/use-collections";

import CollectionSidebar from "@/features/collections/components/collection-sidebar/collection-sidebar";
import { CollectionDetail } from "@/features/collections/components/collection-detail/collection-detail";
import { useCurrentWorkspace } from "@/features/workspaces/hooks/use-current-workspace";

export default function CollectionsPage() {
  const { currentWorkspaceId } = useCurrentWorkspace();

  const { data: collections = [] } = useCollections(currentWorkspaceId);

  const [selectedCollectionId, setSelectedCollectionId] =
    useState<string | null>(null);

  const activeCollectionId =
    selectedCollectionId ?? collections[0]?.id ?? "";

  const activeCollection = collections.find(
    (collection) => collection.id === activeCollectionId,
  );

  return (
    <div className="flex h-full min-h-0 w-full overflow-hidden">
      <CollectionSidebar
        selectedCollectionId={selectedCollectionId}
        onSelectCollection={setSelectedCollectionId}
      />

      <CollectionDetail collection={activeCollection} />
    </div>
  );
}