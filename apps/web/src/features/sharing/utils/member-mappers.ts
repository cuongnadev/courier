import { FALLBACKAVATAR } from "@/constants";

import type { User } from "@/features/auth/types";
import type { ShareMember } from "@/features/sharing/types";

export function createOwnerMember(
  user: User | null,
): ShareMember[] {
  if (!user) {
    return [];
  }

  return [
    {
      id: user.id,
      name:
        user.fullName ??
        user.email ??
        "Current user",
      email: user.email,
      role: "owner",
      avatarUrl:
        user.photoUrl ??
        FALLBACKAVATAR,
      removable: false,
    },
  ];
}