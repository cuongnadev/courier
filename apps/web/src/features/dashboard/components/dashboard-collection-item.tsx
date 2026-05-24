import { FolderIcon } from "@/components/common/icons";
import { COLLECTION_COLORS } from "@/constants/collection";

import type { DashboardCollection } from "@/features/dashboard/types/dashboard.type";

type DashboardCollectionItemProps = {
  collection: DashboardCollection;
};

const collectionBackgroundStyles: Record<
  (typeof COLLECTION_COLORS)[number],
  string
> = {
  "#3B82F6": "bg-[#3B82F615]",

  "#10B981": "bg-[#10B98115]",

  "#F59E0B": "bg-[#F59E0B15]",

  "#8B5CF6": "bg-[#8B5CF615]",

  "#EF4444": "bg-[#EF444415]",

  "#EC4899": "bg-[#EC489915]",
};

export function DashboardCollectionItem({
  collection,
}: DashboardCollectionItemProps) {
  const backgroundColor =
    collectionBackgroundStyles[collection.color];

  return (
    <div className="flex items-center gap-3 p-2 hover:bg-neutral-50 rounded-[12px]">
      <div
        className={`
            flex h-8 w-8 items-center justify-center
            rounded-[12px]
            ${backgroundColor}
        `}
      >
        <FolderIcon
          iconColor={collection.color}
        />
      </div>

      <div>
        <p className="text-sm font-medium text-neutral-900">
          {collection.name}
        </p>

        <p className="text-xs font-normal text-neutral-500">
          {collection.requestsCount} requests
        </p>
      </div>
    </div>
  );
}