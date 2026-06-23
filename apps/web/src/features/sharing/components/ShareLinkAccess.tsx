import { Globe2, Lock } from "lucide-react";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Field,
  FieldDescription,
  FieldLabel,
} from "@courier/ui-kit";

import {
  sharePermissionLabels,
} from "@/features/sharing/utils";

import type {
  SharePermission,
} from "@/features/sharing/types";

type ShareLinkAccessProps = {
  permission: SharePermission;
  onChange: (
    permission: SharePermission,
  ) => void;
};

const permissions: SharePermission[] = [
  "private",
  "viewer",
  "editor",
];

export function ShareLinkAccess({
  permission,
  onChange,
}: ShareLinkAccessProps) {
  return (
    <Field className="gap-2">
      <FieldLabel className="text-[#404040]">
        Link access
      </FieldLabel>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="
              h-11.5 w-full justify-between rounded-[12px]
              border border-[#D6D3CF]
              bg-white px-4 shadow-none
              text-neutral-900

              hover:bg-[#F5F5F5]
              hover:text-neutral-900
            "
          >
            <div className="flex items-center gap-3">
              {permission === "private" ? (
                <Lock
                  size={16}
                  className="text-[#737373]"
                />
              ) : (
                <Globe2
                  size={16}
                  className="text-[#737373]"
                />
              )}

              <span className="text-sm font-medium">
                {
                  sharePermissionLabels[
                    permission
                  ]
                }
              </span>
            </div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          className="
            w-[var(--radix-dropdown-menu-trigger-width)]
            rounded-xl border border-[#E5E5E5]
            bg-white p-2 text-neutral-900
            shadow-[0_8px_30px_rgba(0,0,0,0.08)]
          "
        >
          {permissions.map((item) => (
            <DropdownMenuItem
              key={item}
              onClick={() =>
                onChange(item)
              }
              className="
                cursor-pointer rounded-lg px-3 py-2.5
                text-sm text-neutral-800
                hover:bg-[#F5F5F5]
                focus:bg-[#F5F5F5]
                data-[highlighted]:bg-[#F5F5F5]
              "
            >
              {
                sharePermissionLabels[
                  item
                ]
              }
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <FieldDescription className="text-[#737373]">
        Choose who can access this
        resource using the link.
      </FieldDescription>
    </Field>
  );
}