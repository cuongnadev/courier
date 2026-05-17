import { ChevronRight } from "lucide-react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type SidebarCollectionItemProps = {
    icon: React.ReactNode;
    label: string;
    count?: number;
    open?: boolean;
    children?: React.ReactNode;
    onToggle?: () => void;
};

export function SidebarCollectionItem({
    icon,
    label,
    count,
    open,
    children,
    onToggle,
}: SidebarCollectionItemProps) {
    return (
        <div>
            <button
                onClick={onToggle}
                className="
                    flex h-10 w-full items-center gap-2 rounded-[12px] px-2 py-1.5
                    text-sm font-medium text-[#404040]
                    transition-colors
                    hover:bg-[#F5F5F5]
                "
            >
                <ChevronRight
                    className={`
                        size-4 shrink-0 transition-transform
                        ${open ? "rotate-90" : ""}
                    `}
                />

                <span className="shrink-0">
                    {icon}
                </span>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="flex-1 truncate text-left">
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
                            shadow-lg shadow-black/20
                        "
                    >
                        {label}
                    </TooltipContent>
                </Tooltip>

                {count !== undefined && (
                    <span className="text-xs text-[#A1A1A1]">
                        {count}
                    </span>
                )}
            </button>

            {open && (
                <div className="mt-1 ml-9 space-y-1">
                    {children}
                </div>
            )}
        </div>
    );
}