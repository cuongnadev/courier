import { CollectionDetailHeader } from "./collection-detail-header";
import { CollectionDetailList } from "./collection-detail-list";

import type { CollectionDetailResponse } from "@/features/collections/types/collection.type";

type CollectionDetailProps = {
  collection?: CollectionDetailResponse;
};

export function CollectionDetail({ collection }: CollectionDetailProps) {
  if (!collection) {
    return (
      <main className="flex flex-1 items-center justify-center bg-white">
        <p className="text-sm text-[#737373]">
          Select a collection to view details.
        </p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col bg-white">
      <CollectionDetailHeader collection={collection} />

      <CollectionDetailList requests={collection.requests} />
    </main>
  );
}