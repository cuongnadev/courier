import { XIcon } from "@/components/common/icons";

import { Button } from "@repo/ui";

export type ShareMemberRole = "Owner" | "Editor" | "Viewer";

export type ShareMember = {
  id: string;
  name: string;
  email?: string | null;
  role: ShareMemberRole;
  avatarUrl?: string | null;
  removable?: boolean;
};

type ShareMemberItemProps = {
  member: ShareMember;
  onRemove?: (memberId: string) => void;
};

function getMemberInitials(name?: string | null, email?: string | null) {
  const trimmedName = name?.trim();

  if (trimmedName) {
    const parts = trimmedName.split(/\s+/);

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }

    return parts[0].slice(0, 2).toUpperCase();
  }

  const trimmedEmail = email?.trim();

  if (trimmedEmail) {
    return trimmedEmail.slice(0, 2).toUpperCase();
  }

  return "U";
}

export function ShareMemberItem({ member, onRemove }: ShareMemberItemProps) {
  const initials = getMemberInitials(member.name, member.email);
  const canRemove = member.removable && member.role !== "Owner";

  return (
    <div className="flex items-center justify-between rounded-[12px] border border-[#E5E5E5] bg-white p-3">
      <div className="flex min-w-0 items-center gap-3">
        {member.avatarUrl ? (
          <img
            src={member.avatarUrl}
            alt={member.name}
            className="h-9 w-9 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#171717] text-xs font-semibold text-white">
            {initials}
          </div>
        )}

        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-[#171717]">
            {member.name}
          </p>

          {member.email && (
            <p className="truncate text-xs text-[#737373]">{member.email}</p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span className="rounded-full bg-[#F5F5F5] px-3 py-1 text-xs font-medium text-[#525252]">
          {member.role}
        </span>

        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => onRemove?.(member.id)}
            className="
              h-8 rounded-[10px] px-2
              text-[#737373]
              hover:bg-red-50
              hover:text-red-600
            "
          >
            <XIcon width={16} height={16} />
          </Button>
        )}
      </div>
    </div>
  );
}
