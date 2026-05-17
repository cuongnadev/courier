import { FolderIcon } from "@/components/common/icons";
import type { CollectionVariant } from "@/features/collections/types/collection.type";

import type { DashboardCollection } from "@/features/dashboard/types/dashboard.type";

type DashboardCollectionItemProps = {
  collection: DashboardCollection;
};

const collectionVariantStyles: Record<
  CollectionVariant,
  {
    backgroundColor: string;
    iconColor: string;
  }
> = {
  blue: {
    backgroundColor: "bg-[#3B82F615]",
    iconColor: "#3B82F6",
  },

  green: {
    backgroundColor: "bg-[#10B98115]",
    iconColor: "#10B981",
  },

  orange: {
    backgroundColor: "bg-[#F59E0B15]",
    iconColor: "#F59E0B",
  },
  
  purple: {
    backgroundColor: "bg-[#8B5CF615]",
    iconColor: "#8B5CF6",
  },

  red: {
    backgroundColor: "bg-[#EF444415]",
    iconColor: "#EF4444",
  },

  pink: {
    backgroundColor: "bg-[#EC489915]",
    iconColor: "#EC4899",
  },
};

export function DashboardCollectionItem({
  collection,
}: DashboardCollectionItemProps) {
  const styles =
    collectionVariantStyles[collection.variant];

  return (
    <div className="flex items-center gap-3 p-2 hover:bg-neutral-50 rounded-[12px]">
      <div
        className={`
            flex h-8 w-8 items-center justify-center
            rounded-[12px]
            ${styles.backgroundColor}
        `}
      >
        <FolderIcon
          iconColor={styles.iconColor}
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