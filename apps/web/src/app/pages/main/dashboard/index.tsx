import { Button } from "@/components/ui/button";
import { ActivityIcon, FlowsIcon, FolderIcon, Logo, SendIcon, TeamIcon } from "@/components/common/icons";

import { DashboardStatCard } from "@/features/dashboard/components/dashboard-stat-card";
import { RecentActivityItem } from "@/features/dashboard/components/recent-activity-item";
import { DashboardCollectionItem } from "@/features/dashboard/components/dashboard-collection-item";

import type { DashboardCollection, RecentActivity } from "@/features/dashboard/types/dashboard.type";
import { DashboardFlowItem } from "@/features/dashboard/components/dashboard-active-flows-item";

const stats = [
  {
    label: "Total Requests",
    value: "1,247",
    icon: SendIcon,
    badge: "+12.3%",
  },
  {
    label: "Collections",
    value: "3",
    icon: FolderIcon,
    badge: "+2",
  },
  {
    label: "Active Flows",
    value: "2",
    icon: FlowsIcon,
  },
  {
    label: "Team Members",
    value: "4",
    icon: TeamIcon,
    badge: "+1",
  },
];

const recentActivities: RecentActivity[] = [
  {
    id: 1,
    method: "POST",
    name: "User Login",
    url: "https://api.example.com/v1/auth/login",
    time: "245ms",
    timestamp: "21:30:15",
    status: "200 OK",
    success: true,
  },
  {
    id: 2,
    method: "GET",
    name: "List Product",
    url: "https://api.shop.com/v2/products?page=1&limit=20",
    time: "189ms",
    timestamp: "21:25:42",
    status: "200 OK",
    success: true,
  },
  {
    id: 3,
    method: "GET",
    name: "Get User Profile",
    url: "https://api.example.com/v1/users/me",
    time: "102ms",
    timestamp: "21:20:10",
    status: "401 Unauthorized",
    success: false,
  },
];

const collections: DashboardCollection[] = [
  {
    id: 1,
    name: "User Authentication API",
    requests: 3,
    variant: "blue",
  },
  {
    id: 2,
    name: "E-Commerce Products",
    requests: 2,
    variant: "green",
  },
  {
    id: 3,
    name: "Payment Gateway",
    requests: 1,
    variant: "orange",
  },
];

const activeFlows = [
  {
    id: 1,
    name: "User Onboarding Flow",
    nodes: 4,
  },
  {
    id: 2,
    name: "Payment Processing",
    nodes: 0,
  },
];

export default function DashboardPage() {
  return (
    <div className="p-6 h-full w-full overflow-y-auto dashboard-scrollbar">
      <div className="space-y-6">
        {/* welcome */}
        <section className="p-8 relative overflow-hidden rounded-[16px] bg-[linear-gradient(135deg,#1C1917_0%,#101828_50%,#262626_100%)] text-white shadow-sm">
          <div>
            <h1 className="w-[80%] text-[30px] font-bold">
              Welcome back, CuongDev!
            </h1>

            <p className="mt-2 w-[80%] text-[18px] text-[#D6D3D1]">
              You have 4 successful requests today
            </p>

            <div className="mt-4 flex items-center gap-2">
              <Button className="px-4 py-2 h-10.5 bg-amber-500 rounded-[12px] text-[16px] text-gray-900 font-medium hover:bg-amber-400 transition-colors shadow-sm">
                New Request
              </Button>

              <Button className="px-4 py-2 h-10.5 bg-white/10 backdrop-blur-sm rounded-lg text-[16px] text-white font-medium hover:bg-white/20 transition-colors border-[1.25px] border-white/20 hover:border-white/30">
                Create Flow
              </Button>
            </div>
          </div>

          <Logo
            width={64}
            height={64}
            backgroundColor="#FE9A001A"
            iconColor="#FE9A00"
            className="w-32 h-32 absolute right-6 top-1/2 -translate-y-1/2 border-[1.25px]! border-[#FE9A0033]! shadow-none"
          />
        </section>

        {/* stats */}
        <section className="grid grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <DashboardStatCard
                label={stat.label}
                value={stat.value}
                badge={stat.badge}
                icon={Icon}
              />
            );
          })}
        </section>

        <section className="grid grid-cols-[6.8fr_3.2fr] gap-6">
          {/* left side: table recent activity */}
          <div className="rounded-2xl border-[1.25px] border-[#E5E5E5] bg-white shadow-sm">
            {/* table title */}
            <div className="p-5 flex items-center justify-between border-b-[1.25px] border-[#E5E5E5]">
              <div className="flex items-center justify-between gap-2">
                <ActivityIcon width={20} height={20} />
                <h2 className="text-[20px] font-semibold text-neutral-900">
                  Recent Activity
                </h2>
              </div>

              <Button className="p-0 bg-transparent hover:bg-transparent text-sm font-medium text-[#E17100] hover:text-amber-700">
                View All
              </Button>
            </div>

            {/* list recent activity item */}
            <div>
              {recentActivities.map((activity) => (
                <RecentActivityItem
                  key={activity.id}
                  activity={activity}
                />
              ))}
            </div>
          </div>

          {/* right side: collection, active flows */}
          <div className="space-y-4">
            {/* collections */}
            <div className="rounded-2xl border-[1.25px] border-[#E5E5E5] bg-white shadow-sm">
              {/* table title */}
              <div className="p-4 flex items-center border-b-[1.25px] border-[#E5E5E5]">
                <h2 className="text-[20px] font-semibold text-neutral-900">
                  Collections
                </h2>
              </div>

              {/* list collections */}
              <div className="space-y-3 p-3">
                {collections.map((collection) => (
                  <DashboardCollectionItem
                    key={collection.id}
                    collection={collection}
                  />
                ))}
              </div>
            </div>

            {/* active flows */}
            <div className="rounded-2xl border-[1.25px] border-[#E5E5E5] bg-white shadow-sm">
              {/* table title */}
              <div className="p-4 flex items-center border-b-[1.25px] border-[#E5E5E5]">
                <h2 className="text-[20px] font-semibold text-neutral-900">
                  Active Flows
                </h2>
              </div>

              {/* list active flows */}
              <div className="space-y-3 p-3">
                {activeFlows.map((flow) => (
                  <DashboardFlowItem
                    key={flow.id}
                    flow={flow}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}