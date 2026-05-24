import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TooltipCustom } from "@/components/common/tooltip/tooltip-custom";

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
            <TooltipCustom 
                label={label} 
                side="right"
                sideOffset={8}
            >
                <Button
                    onClick={onToggle}
                    className="
                        flex h-10 w-full items-center gap-2 rounded-[12px] px-2 py-1.5
                        text-sm font-medium text-[#404040]
                        transition-colors
                        bg-transparent hover:bg-[#F5F5F5]
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

                    <span className="flex-1 truncate text-left">
                        {label}
                    </span>

                    {count !== undefined && (
                        <span className="text-xs text-[#A1A1A1]">
                            {count}
                        </span>
                    )}
                </Button>
            </TooltipCustom>

            {open && (
                <div className="mt-1 ml-9 space-y-1">
                    {children}
                </div>
            )}
        </div>
    );
}