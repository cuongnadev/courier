import type { ReactNode } from "react";

type ProfileFactProps = {
  icon: ReactNode;
  iconClassName: string;
  label: string;
  value?: string | null;
};

export function ProfileFact({
  icon,
  iconClassName,
  label,
  value,
}: ProfileFactProps) {
  return (
    <div className="flex items-start gap-3 rounded-[12px] border border-[#E5E5E5] bg-white px-4 py-3">
      <div
        className={`
          mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
          ${iconClassName}
        `}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-xs font-medium uppercase tracking-[0.04em] text-[#737373]">
          {label}
        </div>
        <div className="mt-1 wrap-break-word text-sm font-medium text-[#171717]">
          {value?.trim() || "Not set"}
        </div>
      </div>
    </div>
  );
}
