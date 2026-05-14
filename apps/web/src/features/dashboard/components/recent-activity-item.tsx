import type { RequestMethod } from "@/types/api";

import { ActivityIcon, CheckCircleIcon, ClockIcon } from "@/components/common/icons";

import type { RecentActivity } from "@/features/dashboard/types/dashboard.type";

type RecentActivityItemProps = {
  activity: RecentActivity
};

const methodStyles: Record<RequestMethod, string> = {
  GET: "bg-[#FEF3C6] text-[#7B3306]",
  POST: "bg-[#DCFCE7] text-[#008236]",
  PUT: "bg-[#DBEAFE] text-[#1D4ED8]",
  PATCH: "bg-[#FCE7F3] text-[#BE185D]",
  DELETE: "bg-[#FEE2E2] text-[#B91C1C]",
};

export function RecentActivityItem({ activity }: RecentActivityItemProps) {
  return (
    <div className="flex items-start gap-3 border-b border-[#F0F0F0] p-4 last:border-b-0 hover:bg-neutral-50">
      <div
        className={
          activity.success
            ? "flex items-center justify-center rounded-[12px] bg-[#DCFCE7] p-2"
            : "flex items-center justify-center rounded-[12px] bg-[#FFE2E2] p-2"
        }
      >
        {activity.success ? (
          <CheckCircleIcon
            width={16}
            height={16}
            iconColor="#00A63E"
          />
        ) : (
          <ActivityIcon
            width={16}
            height={16}
            iconColor="#E7000B"
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={`
                rounded px-2 py-0.5
                text-xs font-semibold
                ${methodStyles[activity.method]}
            `}
          >
            {activity.method}
          </span>

          <p className="text-sm font-medium text-neutral-900">
            {activity.name}
          </p>
        </div>

        <p className="mt-1 truncate text-xs font-normal text-neutral-500">
          {activity.url}
        </p>

        <div className="mt-1 flex items-center gap-2 text-xs font-normal text-[#A1A1A1]">
          <div className="flex items-center gap-1">
            <ClockIcon />
            <span>{activity.time}</span>
          </div>
          <span>{activity.timestamp}</span>
          <span
            className={
              activity.success
                ? "font-medium text-[#00A63E]"
                : "font-medium text-[#E7000B]"
            }
          >
            {activity.status}
          </span>
        </div>
      </div>
    </div>
  );
}