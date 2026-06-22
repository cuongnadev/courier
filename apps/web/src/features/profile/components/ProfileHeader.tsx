import { Mail, VenusAndMars } from "lucide-react";

import type { User } from "@/features/auth/types";

type ProfileHeaderProps = {
  user: User | null;
  avatarUrl: string;
  initials: string;
  gender: string | null;
  memberSince: string | null;
};

export function ProfileHeader({
  user,
  avatarUrl,
  initials,
  gender,
  memberSince,
}: ProfileHeaderProps) {
  return (
    <section className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-[18px] bg-neutral-100">
          <img
            src={avatarUrl}
            alt={user?.fullName ? `${user.fullName} avatar` : "User avatar"}
            className="h-full w-full object-cover"
          />

          {!user?.photoUrl && (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-900 text-xl font-semibold text-white">
              {initials}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <h2 className="truncate text-2xl font-semibold text-[#171717]">
            {user?.fullName || "Unknown user"}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[#737373]">
            <span className="inline-flex items-center gap-1.5">
              <Mail size={15} />
              {user?.email || "No email"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <VenusAndMars size={15} />
              {gender ?? "Gender not set"}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-[12px] border border-[#E5E5E5] bg-[#FAFAFA] px-4 py-3">
        <div className="text-xs font-medium uppercase tracking-[0.04em] text-[#737373]">
          Member since
        </div>
        <div className="mt-1 text-sm font-semibold text-[#171717]">
          {memberSince ?? "Not set"}
        </div>
      </div>
    </section>
  );
}
