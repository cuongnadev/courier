import type { ReactNode } from "react";

type MetricTileProps = {
  icon: ReactNode;
  iconClassName: string;
  label: string;
  value: string;
  loading: boolean;
};

export function MetricTile({
  icon,
  iconClassName,
  label,
  value,
  loading,
}: MetricTileProps) {
  return (
    <div className="rounded-[12px] border border-[#E5E5E5] bg-[#FAFAFA] p-4">
      <div className="flex items-center justify-between text-[#737373]">
        <span className="text-xs font-medium uppercase tracking-[0.04em]">
          {label}
        </span>
        <span
          className={`
            flex h-8 w-8 items-center justify-center rounded-[8px]
            ${iconClassName}
          `}
        >
          {icon}
        </span>
      </div>
      <div className="mt-3 text-xl font-semibold text-[#171717]">
        {loading ? "..." : value}
      </div>
    </div>
  );
}
