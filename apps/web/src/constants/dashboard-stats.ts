import { FlowsIcon, FolderIcon, SendIcon, TeamIcon } from "@/components/common/icons";

export const DASHBOARD_STATS = [
  {
    key: "total_requests",
    label: "Total Requests",
    icon: SendIcon,
  },
  {
    key: "collections_count",
    label: "Collections",
    icon: FolderIcon,
  },
  {
    key: "active_flows_count",
    label: "Active Flows",
    icon: FlowsIcon,
  },
  {
    key: "team_members",
    label: "Team Members",
    icon: TeamIcon,
  },
] as const;