import { Button } from "@/components/ui/button";
import {
  PlusIcon,
  DownloadIcon,
  FolderIcon,
  ShareIcon,
} from "@/components/common/icons";

import type { CollectionDetailResponse } from "@/features/collections/types/collection.type";

import { collectionBackgroundStyles } from "@/features/collections/utils/collection-color.util";
import { formatDate } from "@/lib/utils";

type CollectionDetailHeaderProps = {
  collection: CollectionDetailResponse;
};

export function CollectionDetailHeader({
  collection,
}: CollectionDetailHeaderProps) {
  const backgroundColor = collectionBackgroundStyles[collection.color];

  return (
    <header className="p-6 bg-[#FAFAFA] border-b-[1.25px] border-b-[#E5E5E5]">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div
            className={`
              p-3.5 flex h-14 w-14 items-center justify-center
              rounded-[16px]
              ${backgroundColor}
            `}
          >
            <FolderIcon width={28} height={28} iconColor={collection.color} />
          </div>

          <div>
            <h1 className="text-[24px] font-bold leading-8 text-[#171717]">
              {collection.name}
            </h1>

            {collection.description && (
              <p className="mt-1 text-[16px] font-normal text-[#525252]">
                {collection.description}
              </p>
            )}

            <div className="mt-4 flex items-center gap-3 text-[14px] text-[#737373]">
              <p>
                Total Requests:{" "}
                <span className="font-medium text-[#171717]">
                  {collection.requestsCount}
                </span>
              </p>

              <p>
                Created:{" "}
                <span className="font-medium text-[#171717]">
                  {formatDate(collection.createdAt)}
                </span>
              </p>

              <p>
                Last Updated:{" "}
                <span className="font-medium text-[#171717]">
                  {formatDate(collection.updatedAt)}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-10 px-4 rounded-[12px] border-[1.25px] border-[#E5E5E5] bg-white hover:bg-neutral-50 text-sm font-medium text-[#1C1917] hover:text-[#1C1917]"
          >
            <ShareIcon width={16} height={16} />
            Share
          </Button>

          <Button
            variant="outline"
            className="h-10 px-4 rounded-[12px] border-[1.25px] border-[#E5E5E5] bg-white hover:bg-neutral-50 text-sm font-medium text-[#1C1917] hover:text-[#1C1917]"
          >
            <DownloadIcon width={16} height={16} />
            Export
          </Button>

          <Button className="h-10 px-4 rounded-[12px] bg-[#155DFC] text-sm font-medium text-white hover:bg-blue-700">
            <PlusIcon width={16} height={16} iconColor="white" />
            Add Request
          </Button>
        </div>
      </div>
    </header>
  );
}