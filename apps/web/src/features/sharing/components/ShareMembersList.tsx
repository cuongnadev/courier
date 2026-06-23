import {
  ShareMemberItem,
} from "./ShareMemberItem";

import type {
  ShareMember,
} from "@/features/sharing/types";

type Props = {
  members: ShareMember[];
  onRemove?: (
    memberId: string,
  ) => void;
};

export function ShareMembersList({
  members,
  onRemove,
}: Props) {
  if (!members.length) {
    return (
      <div className="rounded-[12px] border border-dashed border-[#E5E5E5] bg-[#FAFAFA] p-4 text-sm text-[#737373]">
        No member information available.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {members.map((member) => (
        <ShareMemberItem
          key={member.id}
          member={member}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}