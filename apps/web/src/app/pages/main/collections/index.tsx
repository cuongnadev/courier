import { useState } from "react";

import { useAuthStore } from "@/features/auth/store/auth.store";
import { useCollections } from "@/features/collections/hooks/use-collections";
import { useWorkspaces } from "@/features/workspaces/hooks/use-workspaces";

import CollectionSidebar from "@/features/collections/components/collection-sidebar/collection-sidebar";
import { CollectionDetail } from "@/features/collections/components/collection-detail/collection-detail";

export default function CollectionsPage() {
  const user = useAuthStore((state) => state.user);
  const { data: workspaces = [] } = useWorkspaces();

  const currentWorkspace = workspaces.find(
    (workspace) => workspace.ownerId === user?.id,
  );

  const { data: collections = [] } = useCollections(currentWorkspace?.id);

  const [selectedCollectionId, setSelectedCollectionId] =
    useState<string | null>(null);

  const activeCollectionId =
    selectedCollectionId ?? collections[0]?.id ?? "";

  const activeCollection = collections.find(
    (collection) => collection.id === activeCollectionId,
  );
  
  return (
    <div className="flex h-full w-full overflow-y-auto dashboard-scrollbar">
      <CollectionSidebar
        selectedCollectionId={selectedCollectionId}
        onSelectCollection={setSelectedCollectionId}
      />
      
      <CollectionDetail collection={activeCollection} />
    </div>
  );
}