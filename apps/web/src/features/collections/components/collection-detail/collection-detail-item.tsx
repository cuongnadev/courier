import { Link } from "@tanstack/react-router";

import type { ApiRequestListItem } from "@/features/requests/types/request.type";

import { ChevronRightIcon } from "@/components/common/icons";

import { requestMethodStyles } from "@/features/requests/utils/request-method-style.util";

import { formatDate } from "@/lib/utils";

type CollectionDetailItemProps = {
  request: ApiRequestListItem;
};

export function CollectionDetailItem({
  request,
}: CollectionDetailItemProps) {
  return (
    <Link
      to={`/requests/${request.id}`}
      className="
        group block w-full rounded-[12px]
        border-[1.25px] border-[#E5E5E5]
        bg-white p-4 text-left

        transition-colors duration-200

        hover:border-amber-300 
        hover:shadow-sm
      "
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <span
              className={`
                rounded-[4px] px-2 py-1
                text-xs font-bold
                ${requestMethodStyles[request.method]}
              `}
            >
              {request.method}
            </span>

            <h3 className="truncate text-[18px] font-medium text-[#171717]">
              {request.name}
            </h3>
          </div>

          <p className="mt-1 truncate font-normal text-xs text-[#737373]">
            {request.uri}
          </p>

          {request.description && (
            <p className="mt-1 line-clamp-2 font-normal text-sm text-[#525252]">
              {request.description}
            </p>
          )}
        </div>

        <div
          className="
            shrink-0
          "
        >
          <ChevronRightIcon
            width={20}
            height={20}
          />
        </div>
      </div>

      <div
        className="
          mt-4 flex items-center justify-between
          border-t border-[#F0F0F0] pt-3
        "
      >
        <div className="flex items-center gap-3 text-xs text-[#737373]">
          <span>
            {request.headersCount} headers
          </span>

          {request.hasBody && (
            <span>Body included</span>
          )}
        </div>

        <span className="text-xs text-[#737373]">
          Updated {formatDate(request.updatedAt)}
        </span>
      </div>
    </Link>
  );
}