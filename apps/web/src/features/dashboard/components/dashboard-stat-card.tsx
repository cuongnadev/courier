import type { IconProps } from "@/types/common";

type DashboardStatCardProps = {
  label: string;
  value: string;
  badge?: string;
  icon: React.ComponentType<IconProps>;
};

export function DashboardStatCard({
  label,
  value,
  badge,
  icon: Icon,
}: DashboardStatCardProps) {
  return (
    <div className="rounded-[16px] border-[1.25px] border-[#E5E5E5] bg-white p-5.5 hover:shadow-md">
      <div className="flex h-10 items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#FFFBEB]">
          <Icon
            width={20}
            height={20}
            iconColor="#E17100"
          />
        </div>

        {badge && (
          <span className="rounded-[4px] bg-[#ECFDF5] px-2 py-1 text-xs font-medium text-[#007A55]">
            {badge}
          </span>
        )}
      </div>

      <p className="mt-3 text-2xl font-bold text-neutral-900">
        {value}
      </p>

      <p className="mt-1 text-sm font-normal text-neutral-500">
        {label}
      </p>
    </div>
  );
}