import type { RequestMethod } from "@/types/api.type";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@courier/ui-kit";

import { requestMethodTextStyles } from "@/features/requests/utils/request-method-style.util";
import type { CSSProperties } from "react";

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
          !h-11 min-h-11 w-[120px] rounded-[12px]
          border-[1.25px] border-[#E5E5E5]
          bg-white px-4
          text-sm font-semibold
          shadow-none

          hover:bg-white
          focus:ring-0
          focus:ring-offset-0
          data-[state=open]:border-[#D4D4D4]
          data-[state=open]:bg-white

          [&>span]:line-clamp-none
          [&>span]:flex
          [&>span]:items-center

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
        {METHODS.map((method) => {
          const methodColor = getColorFromTextClass(
            requestMethodTextStyles[method],
          );

          return (
            <SelectItem
              key={method}
              value={method}
              style={
                {
                  "--method-color": methodColor,
                } as CSSProperties
              }
              className="
                h-9 cursor-pointer rounded-[8px]
                px-3 pr-8
                text-sm font-semibold
                outline-none
                transition-colors

                !text-[var(--method-color)]

                hover:!bg-amber-50
                hover:!text-[var(--method-color)]

                focus:!bg-amber-50
                focus:!text-[var(--method-color)]

                data-[highlighted]:!bg-amber-50
                data-[highlighted]:!text-[var(--method-color)]

                data-[state=checked]:!bg-amber-100
                data-[state=checked]:!text-[var(--method-color)]

                [&>span]:!text-[var(--method-color)]
                [&_span]:!text-[var(--method-color)]
                [&_svg]:!text-[var(--method-color)]
              "
            >
              {method}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

function getColorFromTextClass(className: string) {
  const match = className.match(/text-\[(#[0-9A-Fa-f]{3,8})\]/);
  return match?.[1] ?? "#171717";
}
