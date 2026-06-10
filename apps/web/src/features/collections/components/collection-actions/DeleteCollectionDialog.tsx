import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@courier/ui-kit";

import type { CollectionResponse } from "@/features/collections/types/collection.type";

type DeleteCollectionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collection: CollectionResponse | null;
  isPending?: boolean;
  onConfirm: () => void | Promise<void>;
};

export function DeleteCollectionDialog({
  open,
  onOpenChange,
  collection,
  isPending,
  onConfirm,
}: DeleteCollectionDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className="
          !w-[calc(100vw-32px)] !max-w-[420px]
          gap-0 overflow-hidden rounded-[16px]
          border border-[#E5E5E5]
          bg-white p-0 text-[#171717]
          shadow-[0_20px_60px_rgba(0,0,0,0.16)]
        "
      >
        <AlertDialogHeader className="bg-white px-6 pt-6 pb-5 text-left">
          <AlertDialogTitle className="text-xl font-semibold text-[#171717]">
            Delete collection?
          </AlertDialogTitle>

          <AlertDialogDescription className="mt-2 text-sm leading-6 text-[#525252]">
            This will delete{" "}
            <span className="font-semibold text-[#171717]">
              {collection?.name ?? "this collection"}
            </span>
            . This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div
          className="
            flex items-center justify-end gap-3
            border-t border-[#E5E5E5]
            bg-white px-6 pt-5 pb-6
          "
        >
          <AlertDialogCancel
            disabled={isPending}
            className="
              m-0 h-10 rounded-[12px]
              border border-[#D6D3CF]
              bg-white px-4
              text-sm font-medium text-[#171717]
              hover:bg-[#F5F5F5]
              hover:text-[#171717]
              focus-visible:ring-0
              focus-visible:ring-offset-0
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={isPending}
            onClick={(event) => {
              event.preventDefault();
              void onConfirm();
            }}
            className="
              h-10 rounded-[12px]
              bg-red-600 px-4
              text-sm font-medium text-white
              hover:bg-red-700
              focus-visible:ring-0
              focus-visible:ring-offset-0
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
