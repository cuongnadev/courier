import { CollectionDetailItem } from "@/features/collections/components/collection-detail";

import type { ApiRequestListItem } from "@/features/requests/types/request.type";

type CollectionDetailListProps = {
  requests: readonly ApiRequestListItem[];
};

export function CollectionDetailList({
  requests,
}: CollectionDetailListProps) {
  return (
    <section className="flex-1 p-6">
      <div className="space-y-2">
        {requests.map((request) => (
          <CollectionDetailItem
            key={request.id}
            request={request}
          />
        ))}
      </div>
    </section>
  );
}