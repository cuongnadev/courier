import { Link } from "@tanstack/react-router";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { RequestMethod } from "@/types/api";

type SidebarSubItemProps = {
    to: string;
    method: RequestMethod;
    label: string;
};

const methodStyles: Record<RequestMethod, string> = {
    GET: "bg-[#FEF3C6] text-[#7B3306]",
    POST: "bg-[#DCFCE7] text-[#008236]",
    PUT: "bg-[#DBEAFE] text-[#1D4ED8]",
    PATCH: "bg-[#FCE7F3] text-[#BE185D]",
    DELETE: "bg-[#FEE2E2] text-[#B91C1C]",
};

export function SidebarSubItem({
    to,
    method,
    label,
}: SidebarSubItemProps) {
    return (
        <Link
            to={to}
            activeProps={{
                className:
                    "bg-[#F5F5F5]",
            }}
            className="
                flex h-9 items-center gap-2 rounded-lg px-2 py-1.5
                text-sm font-normal text-[#525252]
                transition-colors
                hover:bg-[#F5F5F5]
            "
        >
            <span
                className={`
                    rounded px-1.5 py-0.5 text-[10px] font-semibold
                    ${methodStyles[method]}
                `}
            >
                {method}
            </span>

            <Tooltip>
                <TooltipTrigger asChild>
                    <span className="truncate">
                        {label}
                    </span>
                </TooltipTrigger>

                <TooltipContent
                    side="right"
                    sideOffset={20}
                    className="
                        rounded-full border border-[#2A2A2A]
                        bg-[#181818] px-3 py-2
                        text-xs font-medium text-white
                    "
                >
                    {label}
                </TooltipContent>
            </Tooltip>

        </Link>
    );
}