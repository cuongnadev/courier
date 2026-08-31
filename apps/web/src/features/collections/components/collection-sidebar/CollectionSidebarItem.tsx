import { FolderIcon } from "@/components/common/icons";
import { HighlightText } from "@/components/common/text/HighlightText";

import type { CollectionResponse } from "@/features/collections/types";

import { collectionBackgroundStyles } from "@/features/collections/utils";

import { CollectionItemActions } from "../collection-actions/CollectionItemActions";

type CollectionSidebarItemProps = {
  searchQuery?: string;

  collection: CollectionResponse;

  isActive?: boolean;

  onClick?: () => void;
  onEditCollection?: (collection: CollectionResponse) => void;
  onDeleteCollection?: (collection: CollectionResponse) => void;
};

export function CollectionSidebarItem({
  searchQuery = "",
  collection,
  isActive = false,
  onClick,
  onEditCollection,
  onDeleteCollection
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
              {/* {collection.name} */}
              <HighlightText
                text={collection.name}
                query={searchQuery}
              />
            </p>

            <CollectionItemActions
              collection={collection}
              onEdit={(collection) => onEditCollection?.(collection)}
              onDelete={(collection) => onDeleteCollection?.(collection)}
            />
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