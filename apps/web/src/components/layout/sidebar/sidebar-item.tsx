import { Link } from "@tanstack/react-router";

type SidebarItemProps = {
    to: string;
    icon: React.ReactNode;
    label: string;
    count?: number;
};

export function SidebarItem({
    to,
    icon,
    label,
    count,
}: SidebarItemProps) {
    return (
        <Link
            to={to}
            activeProps={{
                className:
                    "bg-[#FFFBEB] text-[#7B3306] font-medium hover:bg-[#FFFBEB]",
            }}
            inactiveProps={{
                className:
                    "text-[#404040] font-normal hover:bg-[#F5F5F5]",
            }}
            className="
                flex h-10 items-center gap-2 rounded-[12px] px-3
                text-sm transition-colors
            "
        >
            <span className="shrink-0">
                {icon}
            </span>

            <span className="flex-1 truncate">
                {label}
            </span>

            {count !== undefined && (
                <span className="text-xs text-[#A1A1A1]">
                    {count}
                </span>
            )}
        </Link>
    );
}