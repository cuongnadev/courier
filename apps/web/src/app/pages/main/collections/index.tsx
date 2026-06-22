import { useEffect } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";

import { useCollections } from "@/features/collections/hooks";
import { useCurrentWorkspace } from "@/features/workspaces/hooks";

import { CollectionSidebar } from "@/features/collections/components/collection-sidebar";
import { CollectionDetail } from "@/features/collections/components/collection-detail";

import { ROUTE_TO } from "@/constants";

export default function CollectionsPage() {
  const navigate = useNavigate();

  const params = useParams({
    strict: false,
  });

  const workspaceId = params.workspaceId;
  const collectionId = params.collectionId;

  const { currentWorkspaceId } = useCurrentWorkspace();

  const { data: collections = [], isLoading } = useCollections(currentWorkspaceId);

  const activeCollection =
    collections.find((collection) => collection.id === collectionId) ?? null;

  useEffect(() => {
    if (!workspaceId) return;
    if (collectionId) return;
    if (collections.length === 0) return;

    void navigate({
      to: ROUTE_TO.WORKSPACE_COLLECTION_DETAIL,
      params: {
        workspaceId,
        collectionId: collections[0].id,
      },
      replace: true,
    });
  }, [workspaceId, collectionId, collections, navigate]);

  const handleSelectCollection = (nextCollectionId: string) => {
    if (!workspaceId) return;

    void navigate({
      to: ROUTE_TO.WORKSPACE_COLLECTION_DETAIL,
      params: {
        workspaceId,
        collectionId: nextCollectionId,
      },
    });
  };

  return (
    <div className="flex h-full min-h-0 w-full overflow-hidden">
      <CollectionSidebar
        selectedCollectionId={collectionId ?? null}
        onSelectCollection={handleSelectCollection}
      />

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center text-sm text-[#737373]">
          Loading collection...
        </div>
      ) : activeCollection ? (
        <CollectionDetail workspaceId={workspaceId!} collection={activeCollection} />
      ) : (
        <div className="flex flex-1 items-center justify-center text-sm text-[#737373]">
          No collection selected.
        </div>
      )}
    </div>
  );
}