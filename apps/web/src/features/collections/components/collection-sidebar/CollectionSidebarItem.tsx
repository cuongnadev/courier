import { Button } from "@/components/ui/button";
import { FolderIcon, MoreIcon } from "@/components/common/icons";

import type { CollectionRequest } from "@/features/collections/types/collection.type";
import { collectionBackgroundStyles } from "@/features/collections/utils/collection-color.util";

type CollectionSidebarItemProps = {
  collection: CollectionRequest;

  isActive?: boolean;

  onClick?: () => void;
};

export function CollectionSidebarItem({
  collection,
  isActive = false,
  onClick,
}: CollectionSidebarItemProps) {
  const backgroundColor =
    collectionBackgroundStyles[collection.color];
    
  return (
    <div
      onClick={onClick}
      className={`
        group w-full rounded-[12px]
        border-[1.25px] p-3.5 text-left
        transition-all duration-200
        select-none

        ${isActive
          ? "bg-amber-50 border-amber-200 hover:bg-amber-50"
          : "bg-transparent border-transparent hover:border-neutral-50 hover:bg-neutral-50"
        }
      `}
    >
      <div className="w-full flex items-start gap-3">
        <div
          className={`
            flex p-2.5 shrink-0 items-center justify-center
            rounded-[12px]
            ${backgroundColor}
          `}
        >
          <FolderIcon
            iconColor={collection.color}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p
              className="
                truncate text-sm
                font-medium text-[#171717]
              "
            >
              {collection.name}
            </p>

            <Button
              className="
                p-1 w-5.5 h-5.5 rounded-[4px] bg-transparent
                hover:bg-neutral-100
              "
            >
              <MoreIcon />
            </Button>
          </div>

          {collection.description && (
            <p
              className="
                mt-1 line-clamp-1 text-xs
                font-medium text-[#737373]
              "
            >
              {collection.description}
            </p>
          )}

          <p
            className="
              mt-1 text-xs
              font-medium text-[#A1A1A1]
            "
          >
            {collection.requestsCount} requests
          </p>
        </div>
      </div>
    </div>
  );
}