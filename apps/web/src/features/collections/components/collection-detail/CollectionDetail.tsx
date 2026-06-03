import type { CollectionDetailResponse } from "@/features/collections/types";

import { CollectionDetailHeader, CollectionDetailList } from "@/features/collections/components/collection-detail";

type CollectionDetailProps = {
  workspaceId: string;
  collection?: CollectionDetailResponse;
};

export function CollectionDetail({
  workspaceId,
  collection,
}: CollectionDetailProps) {
  if (!collection) {
    return (
      <main className="flex min-h-0 flex-1 items-center justify-center bg-white">
        <p className="text-sm text-[#737373]">
          Select a collection to view details.
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-0 flex-1 flex-col bg-white">
      <CollectionDetailHeader collection={collection} />

      <div className="min-h-0 flex-1 overflow-y-auto dashboard-scrollbar">
        <CollectionDetailList workspaceId={workspaceId} collectionId={collection.id} requests={collection.requests} />
      </div>
    </main>
  );
}