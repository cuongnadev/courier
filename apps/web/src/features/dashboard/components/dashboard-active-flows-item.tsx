import { FlowsIcon } from "@/components/common/icons";

import type { DashboardFlow } from "@/features/dashboard/types/dashboard.type";

type DashboardFlowItemProps = {
  flow: DashboardFlow;
};

export function DashboardFlowItem({
  flow,
}: DashboardFlowItemProps) {
  return (
    <div className="flex items-center gap-3 p-2 hover:bg-neutral-50 rounded-[12px]">
      <div
        className="
            flex p-2 items-center justify-center
            rounded-[12px]
            bg-[#FFFBEB]
        "
      >
        <FlowsIcon
          width={16}
          height={16}
          iconColor="#E17100"
        />
      </div>

      <div>
        <p className="text-sm font-medium text-neutral-900">
          {flow.name}
        </p>

        <p className="text-xs font-normal text-neutral-500">
          {flow.nodes} nodes
        </p>
      </div>
    </div>
  );
}