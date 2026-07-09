import { CollectionDetailItem } from "@/features/collections/components/collection-detail";

import type { CollectionRequest } from "@/features/collections/types";

type CollectionDetailListProps = {
  workspaceId: string;
  collectionId: string;
  requests: readonly CollectionRequest[];
};

export function CollectionDetailList({
  workspaceId,
  collectionId,
  requests,
}: CollectionDetailListProps) {
  return (
    <section className="flex-1 p-6">
      <div className="space-y-2">
        {requests.map((request) => (
          <CollectionDetailItem
            key={request.id}
            workspaceId={workspaceId}
            collectionId={collectionId}
            request={request}
          />
        ))}
      </div>
    </section>
  );
}