import type { RequestMethod } from "@/types/api.type";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { requestMethodTextStyles } from "@/features/requests/utils/request-method-style.util";

const METHODS = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
] as const satisfies readonly RequestMethod[];

type RequestMethodSelectProps = {
  value: RequestMethod;
  onValueChange: (method: RequestMethod) => void;
};

export function RequestMethodSelect({
  value,
  onValueChange,
}: RequestMethodSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(nextValue) => {
        onValueChange(nextValue as RequestMethod);
      }}
    >
      <SelectTrigger
        className={`
          h-11 w-[120px] rounded-[12px]
          border-[1.25px] border-[#E5E5E5]
          bg-white px-4
          text-sm font-semibold
          shadow-none

          hover:bg-white
          focus:ring-0
          focus:ring-offset-0
          data-[state=open]:border-[#D4D4D4]

          ${requestMethodTextStyles[value]}
        `}
      >
        <SelectValue placeholder="Method" />
      </SelectTrigger>

      <SelectContent
        position="popper"
        sideOffset={6}
        align="start"
        className="
          min-w-[120px] rounded-[12px]
          border border-[#E5E5E5]
          bg-white p-1
          shadow-[0_8px_30px_rgba(0,0,0,0.08)]
        "
      >
        {METHODS.map((method) => (
          <SelectItem
            key={method}
            value={method}
            className={`
              h-9 cursor-pointer rounded-[8px]
              px-3 pr-8
              text-sm font-semibold
              outline-none

              focus:bg-[#F5F5F5]
              data-[highlighted]:bg-[#F5F5F5]
              data-[state=checked]:bg-[#FFFBEB]

              ${requestMethodTextStyles[method]}
            `}
          >
            {method}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}