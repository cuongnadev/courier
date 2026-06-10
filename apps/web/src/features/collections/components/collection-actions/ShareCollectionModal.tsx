import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Copy, Globe2, Lock, Mail } from "lucide-react";

import {
  Button,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@courier/ui-kit";

import { useAuthStore } from "@/features/auth/store/auth.store";

import { ShareMemberItem, type ShareMember } from "./ShareMemberItem";
import { useCurrentWorkspace } from "@/features/workspaces/hooks/use-current-workspace";

type ShareCollectionModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collection: {
    id: string;
    name: string;
  };
};

type SharePermission = "private" | "view" | "edit";

const permissionLabels: Record<SharePermission, string> = {
  private: "Private",
  view: "Anyone with the link can view",
  edit: "Anyone with the link can edit",
};

export function ShareCollectionModal({
  open,
  onOpenChange,
  collection,
}: ShareCollectionModalProps) {
  const [permission, setPermission] = useState<SharePermission>("private");
  const [email, setEmail] = useState("");

  const user = useAuthStore((state) => state.user);

  const { currentWorkspaceId } = useCurrentWorkspace();

  const shareLink = useMemo(() => {
    if (!currentWorkspaceId) {
      return `${window.location.origin}/collections/${collection.id}`;
    }

    return `${window.location.origin}/workspaces/${currentWorkspaceId}/collections/${collection.id}`;
  }, [collection.id, currentWorkspaceId]);

  const members = useMemo<ShareMember[]>(() => {
    if (!user) return [];

    return [
      {
        id: user.id,
        name: user.fullName ?? user.email ?? "Current user",
        email: user.email,
        role: "Owner",
        avatarUrl: user.photoUrl ?? null,
        removable: false,
      },
    ];
  }, [user]);

  const handleClose = () => {
    setEmail("");
    onOpenChange(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      toast.success("Share link copied.");
    } catch {
      toast.error("Failed to copy share link.");
    }
  };

  const handleInvite = () => {
    if (!email.trim()) {
      toast.error("Please enter an email address.");
      return;
    }

    // TODO: call invite API here
    toast.success("Invitation sent.");
    setEmail("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          handleClose();
          return;
        }

        onOpenChange(true);
      }}
    >
      <DialogContent
        className="
          !w-[calc(100vw-32px)] !max-w-[560px]
          gap-0 rounded-[16px]
          border border-[#E5E5E5]
          bg-white p-0 shadow-lg

          [&_[data-slot=dialog-close]]:text-[#525252]
          [&_[data-slot=dialog-close]]:hover:bg-neutral-100
          [&_[data-slot=dialog-close]]:hover:text-[#171717]
        "
      >
        <DialogHeader className="border-b border-[#E5E5E5] p-6">
          <DialogTitle className="text-xl font-semibold text-[#171717]">
            Share Collection
          </DialogTitle>

          <p className="mt-1 text-sm text-[#737373]">
            Manage access for{" "}
            <span className="font-medium text-[#171717]">
              {collection.name}
            </span>
            .
          </p>
        </DialogHeader>

        <FieldGroup className="gap-5 p-6">
          <Field className="gap-2">
            <FieldLabel className="text-[#404040]">Link access</FieldLabel>

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
                      <Lock size={16} className="text-[#737373]" />
                    ) : (
                      <Globe2 size={16} className="text-[#737373]" />
                    )}

                    <span className="text-sm font-medium">
                      {permissionLabels[permission]}
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
                {(["private", "view", "edit"] as SharePermission[]).map(
                  (item) => (
                    <DropdownMenuItem
                      key={item}
                      onClick={() => setPermission(item)}
                      className="
                        cursor-pointer rounded-lg px-3 py-2.5
                        text-sm text-neutral-800 outline-none
                        hover:bg-[#F5F5F5]
                        focus:bg-[#F5F5F5]
                        data-[highlighted]:bg-[#F5F5F5]
                      "
                    >
                      {permissionLabels[item]}
                    </DropdownMenuItem>
                  ),
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <FieldDescription className="text-[#737373]">
              Choose who can access this collection using the link.
            </FieldDescription>
          </Field>

          <Field className="gap-2">
            <FieldLabel className="text-[#404040]">Share link</FieldLabel>

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
                type="button"
                onClick={handleCopyLink}
                className="
                  h-11.5 rounded-[12px]
                  bg-[#171717] px-4
                  text-white
                  hover:bg-[#262626]
                "
              >
                <Copy size={16} />
                Copy
              </Button>
            </div>
          </Field>

          <Field className="gap-2">
            <FieldLabel className="text-[#404040]">Invite by email</FieldLabel>

            <div className="flex gap-2">
              <Input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="teammate@example.com"
                className="
                  h-11.5 rounded-[12px]
                  border border-[#D6D3CF]
                  bg-transparent px-4
                  text-[#171717]
                  placeholder:text-[#1C191780]
                  focus-visible:ring-2
                  focus-visible:ring-amber-500
                "
              />

              <Button
                type="button"
                onClick={handleInvite}
                className="
                  h-11.5 rounded-[12px]
                  bg-[#FE9A00] px-4
                  text-[#171717]
                  hover:bg-amber-400
                "
              >
                <Mail size={16} />
                Invite
              </Button>
            </div>
          </Field>

          <Field className="gap-3">
            <FieldLabel className="text-[#404040]">Members</FieldLabel>

            <div className="space-y-2">
              {members.length > 0 ? (
                members.map((member) => (
                  <ShareMemberItem
                    key={member.id}
                    member={member}
                    onRemove={(memberId) => {
                      // TODO: call remove member API later
                      console.log("Remove member:", memberId);
                    }}
                  />
                ))
              ) : (
                <div className="rounded-[12px] border border-dashed border-[#E5E5E5] bg-[#FAFAFA] p-4 text-sm text-[#737373]">
                  No member information available.
                </div>
              )}

              {/* 
                TODO:
                Khi backend có danh sách members thì render ở đây.
                Hiện tại chưa có members list nên không hard-code fake members.
              */}
            </div>
          </Field>
        </FieldGroup>

        <div className="flex justify-end border-t border-[#E5E5E5] px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="h-10 rounded-[12px]"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
