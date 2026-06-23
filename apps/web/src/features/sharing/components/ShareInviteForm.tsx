import { Mail } from "lucide-react";

import {
  Button,
  Input,
  Field,
  FieldLabel,
} from "@courier/ui-kit";

type Props = {
  email: string;
  onEmailChange: (
    value: string,
  ) => void;
  onInvite: () => void;
};

export function ShareInviteForm({
  email,
  onEmailChange,
  onInvite,
}: Props) {
  return (
    <Field className="gap-2">
      <FieldLabel className="text-[#404040]">
        Invite by email
      </FieldLabel>

      <div className="flex gap-2">
        <Input
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
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
          onClick={onInvite}
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
  );
}