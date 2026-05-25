import type { ReactNode } from "react";

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type IconTooltipButtonProps = {
  label: string;
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
};

export function TooltipCustom({
    label,
    children,
    side = "bottom",
    align,
    sideOffset = 10,
}: IconTooltipButtonProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                {children}
            </TooltipTrigger>

            <TooltipContent
                side={side}
                align={align}
                sideOffset={sideOffset}
                className="
                    rounded-full border border-[#2A2A2A]
                    bg-[#181818] px-3 py-2
                    text-xs font-medium text-white
                    shadow-lg shadow-black/20
                "
            >
                {label}
            </TooltipContent>
        </Tooltip>
    );
}