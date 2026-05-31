import { Pencil, Trash2 } from "lucide-react";
import { MoreIcon } from "@/components/common/icons";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { CollectionResponse } from "@/features/collections/types";

type CollectionItemActionsProps = {
  collection: CollectionResponse;
  onEdit: (collection: CollectionResponse) => void;
  onDelete: (collection: CollectionResponse) => void;
};

export function CollectionItemActions({
  collection,
  onEdit,
  onDelete,
}: CollectionItemActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          onClick={(event) => {
            event.stopPropagation();
          }}
          onPointerDown={(event) => {
            event.stopPropagation();
          }}
          className="
            h-7 w-7 rounded-full bg-transparent p-0
            text-[#737373]
            shadow-none
            hover:bg-neutral-100
            hover:text-[#171717]

            focus:bg-transparent
            focus:text-[#737373]
            focus:outline-none
            focus:ring-0
            focus-visible:outline-none
            focus-visible:ring-0
            focus-visible:ring-offset-0

            data-[state=open]:bg-neutral-100
            data-[state=open]:text-[#171717]
          "
        >
          <MoreIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        side="bottom"
        sideOffset={6}
        alignOffset={-4}
        collisionPadding={12}
        onClick={(event) => {
          event.stopPropagation();
        }}
        className="
          z-50 w-40 rounded-[12px] border border-[#E5E5E5]
          bg-white p-2 text-neutral-900
          shadow-[0_8px_30px_rgba(0,0,0,0.08)]
        "
      >
        <DropdownMenuItem
          onClick={(event) => {
            event.stopPropagation();
            onEdit(collection);
          }}
          className="
            flex cursor-pointer items-center gap-3 rounded-[12px]
            px-3 py-2 text-sm text-neutral-800 outline-none
            hover:bg-[#F5F5F5]
            focus:bg-[#F5F5F5]
            data-[highlighted]:bg-[#F5F5F5]
          "
        >
          <Pencil size={15} />
          Edit
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1 bg-[#E5E5E5]" />

        <DropdownMenuItem
          onClick={(event) => {
            event.stopPropagation();
            onDelete(collection);
          }}
          className="
            flex cursor-pointer items-center gap-3 rounded-[12px]
            px-3 py-2 text-sm text-red-600 outline-none
            hover:bg-red-50
            focus:bg-red-50
            data-[highlighted]:bg-red-50
            data-[highlighted]:text-red-600
          "
        >
          <Trash2 size={15} />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}