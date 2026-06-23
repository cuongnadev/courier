import type { ChangeEventHandler } from "react";
import { Trash2 } from "lucide-react";

import { Button, Input } from "@courier/ui-kit";

type DangerZoneProps = {
  userEmail?: string | null;
  isDeleteConfirmOpen: boolean;
  deleteConfirmValue: string;
  deleteConfirmError: string;
  isDeleting: boolean;
  onOpenDeleteConfirm: () => void;
  onDeleteConfirmChange: ChangeEventHandler<HTMLInputElement>;
  onCancelDeleteConfirm: () => void;
  onDeleteUser: () => void;
};

export function DangerZone({
  userEmail,
  isDeleteConfirmOpen,
  deleteConfirmValue,
  deleteConfirmError,
  isDeleting,
  onOpenDeleteConfirm,
  onDeleteConfirmChange,
  onCancelDeleteConfirm,
  onDeleteUser,
}: DangerZoneProps) {
  return (
    <section className="mt-6 rounded-[12px] border border-red-200 bg-red-50/50 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-semibold text-red-700">
            <Trash2 size={17} />
            Delete account
          </div>
          <p className="mt-2 text-sm leading-6 text-red-700/80">
            This permanently deletes your account. Owned workspaces and their
            data will be removed; historical runs may remain without a user
            owner.
          </p>
        </div>

        {!isDeleteConfirmOpen && (
          <Button
            type="button"
            variant="outline"
            onClick={onOpenDeleteConfirm}
            className="h-10 shrink-0 rounded-[12px] border-red-300 bg-white text-red-700 hover:bg-red-100 hover:text-red-800"
          >
            Delete
          </Button>
        )}
      </div>

      {isDeleteConfirmOpen && (
        <div className="mt-4 rounded-[12px] border border-red-200 bg-white p-4">
          <label
            htmlFor="delete-user-confirmation"
            className="text-sm font-medium text-[#171717]"
          >
            Type{" "}
            <span className="font-semibold text-red-700">
              {userEmail || "your email"}
            </span>{" "}
            to confirm.
          </label>

          <Input
            id="delete-user-confirmation"
            value={deleteConfirmValue}
            onChange={onDeleteConfirmChange}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            aria-invalid={Boolean(deleteConfirmError)}
            className="
              mt-3 h-10 rounded-[12px]
              border border-red-200
              bg-white px-3 text-sm text-[#171717]
              placeholder:text-red-300
              focus-visible:border-red-400
              focus-visible:ring-2
              focus-visible:ring-red-200
            "
            placeholder={userEmail || "your email"}
          />

          {deleteConfirmError && (
            <p className="mt-2 text-sm font-medium text-red-600">
              {deleteConfirmError}
            </p>
          )}

          <div className="mt-4 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={isDeleting}
              onClick={onCancelDeleteConfirm}
              className="h-10 rounded-[12px]"
            >
              Cancel
            </Button>

            <Button
              type="button"
              disabled={isDeleting}
              onClick={onDeleteUser}
              className="h-10 rounded-[12px] bg-red-600 text-white hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete account"}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
