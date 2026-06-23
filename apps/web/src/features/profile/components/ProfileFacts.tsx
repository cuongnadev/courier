import { Clock, Mail, User as UserIcon, VenusAndMars } from "lucide-react";

import { ProfileFact } from "./ProfileFact";

type ProfileFactsProps = {
  fullName?: string | null;
  email?: string | null;
  gender: string | null;
  updatedAt: string | null;
};

export function ProfileFacts({
  fullName,
  email,
  gender,
  updatedAt,
}: ProfileFactsProps) {
  return (
    <section className="mt-6 grid gap-3 md:grid-cols-2">
      <ProfileFact
        icon={<UserIcon size={17} />}
        iconClassName="bg-sky-50 text-sky-600"
        label="Full name"
        value={fullName}
      />
      <ProfileFact
        icon={<Mail size={17} />}
        iconClassName="bg-indigo-50 text-indigo-600"
        label="Email"
        value={email}
      />
      <ProfileFact
        icon={<VenusAndMars size={17} />}
        iconClassName="bg-pink-50 text-pink-600"
        label="Gender"
        value={gender}
      />
      <ProfileFact
        icon={<Clock size={17} />}
        iconClassName="bg-teal-50 text-teal-600"
        label="Last profile update"
        value={updatedAt}
      />
    </section>
  );
}
