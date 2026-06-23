import {
  useMemo,
  useState,
} from "react";

import { toast } from "sonner";
import { Copy } from "lucide-react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Field,
  FieldGroup,
  FieldLabel,
  Input,
} from "@courier/ui-kit";

import {
  ShareInviteForm,
} from "./ShareInviteForm";
import {
  ShareLinkAccess,
} from "./ShareLinkAccess";
import {
  ShareMembersList,
} from "./ShareMembersList";

import {
  shareResourceLabels,
} from "@/features/sharing/utils";

import {
  useShareLink,
} from "@/features/sharing/hooks";

import type {
  ShareMember,
  SharePermission,
  ShareTarget,
} from "@/features/sharing/types";

type Props = {
  open: boolean;
  onOpenChange: (
    open: boolean,
  ) => void;

  target: ShareTarget;

  workspaceId?: string;

  members: ShareMember[];

  onInvite?: (
    email: string,
  ) => Promise<void>;

  onRemoveMember?: (
    memberId: string,
  ) => Promise<void>;
};

export function ShareModal({
  open,
  onOpenChange,
  target,
  workspaceId,
  members,
  onInvite,
  onRemoveMember,
}: Props) {
  const [
    permission,
    setPermission,
  ] =
    useState<SharePermission>(
      "private",
    );

  const [email, setEmail] =
    useState("");

  const shareLink =
    useShareLink(
      target,
      workspaceId,
    );

  const title = useMemo(
    () =>
      shareResourceLabels[
        target.type
      ],
    [target.type],
  );

  const handleClose = () => {
    setEmail("");
    onOpenChange(false);
  };

  const handleCopy =
    async () => {
      try {
        await navigator.clipboard.writeText(
          shareLink,
        );

        toast.success(
          "Share link copied.",
        );
      } catch {
        toast.error(
          "Failed to copy link.",
        );
      }
    };

  const handleInvite =
    async () => {
      const value =
        email.trim();

      if (!value) {
        toast.error(
          "Please enter an email.",
        );
        return;
      }

      try {
        await onInvite?.(
          value,
        );

        toast.success(
          "Invitation sent.",
        );

        setEmail("");
      } catch {
        toast.error(
          "Failed to send invitation.",
        );
      }
    };

  const handleRemove =
    async (
      memberId: string,
    ) => {
      try {
        await onRemoveMember?.(
          memberId,
        );

        toast.success(
          "Member removed.",
        );
      } catch {
        toast.error(
          "Failed to remove member.",
        );
      }
    };

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent
        className="
          !w-[calc(100vw-32px)]
          !max-w-[560px]
          gap-0 rounded-[16px]
          border border-[#E5E5E5]
          bg-white p-0 shadow-lg
        "
      >
        <DialogHeader className="border-b border-[#E5E5E5] p-6">
          <DialogTitle className="text-xl font-semibold text-[#171717]">
            Share {title}
          </DialogTitle>

          <p className="mt-1 text-sm text-[#737373]">
            Manage access for{" "}
            <span className="font-medium text-[#171717]">
              {target.name}
            </span>
            .
          </p>
        </DialogHeader>

        <FieldGroup className="gap-5 p-6">
          <ShareLinkAccess
            permission={
              permission
            }
            onChange={
              setPermission
            }
          />

          <Field className="gap-2">
            <FieldLabel className="text-[#404040]">
              Share link
            </FieldLabel>

            <div className="flex gap-2">
              <Input
                readOnly
                value={shareLink}
                className="
                  h-11.5 rounded-[12px]
                  border border-[#D6D3CF]
                  bg-[#FAFAFA] px-4
                  text-[#171717]
                  focus-visible:ring-2
                  focus-visible:ring-amber-500
                "
              />

              <Button
                onClick={
                  handleCopy
                }
                className="
                  h-11.5 rounded-[12px]
                  bg-[#171717] px-4
                  text-white
                  hover:bg-[#262626]
                "
              >
                <Copy
                  size={16}
                />
                Copy
              </Button>
            </div>
          </Field>

          <ShareInviteForm
            email={email}
            onEmailChange={
              setEmail
            }
            onInvite={
              handleInvite
            }
          />

          <Field className="gap-3">
            <FieldLabel className="text-[#404040]">
              Members
            </FieldLabel>

            <ShareMembersList
              members={
                members
              }
              onRemove={
                handleRemove
              }
            />
          </Field>
        </FieldGroup>

        <div className="flex justify-end border-t border-[#E5E5E5] px-6 py-4">
          <Button
            variant="outline"
            onClick={
              handleClose
            }
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}