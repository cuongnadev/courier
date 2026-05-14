import { 
    HomeIcon, 
    FolderIcon, 
    HistoryIcon, 
    FlowsIcon, 
    EnvIcon,
    MockIcon,
    DocumentationIcon,
    TestIcon,
    ZapIcon,
    SettingIcon, 
    TeamIcon 
} from "@/components/common/icons";

import type { StaticSidebarItem } from "@/types/common";
import type { ToolSidebarItem } from "@/features/tools/types/tool.type";

export const workspaceItems: StaticSidebarItem[] = [
    {
        to: "/",
        label: "Dashboard",
        icon: HomeIcon,
    },
    {
        to: "/collections",
        label: "Collections",
        icon: FolderIcon,
    },
    {
        to: "/history",
        label: "History",
        icon: HistoryIcon,
    },
];

export const toolItems: ToolSidebarItem[] = [
    {
        to: "/flows",
        label: "Flows",
        icon: FlowsIcon,
        countKey: "flows",
    },
    {
        to: "/environments",
        label: "Environments",
        icon: EnvIcon,
    },
    {
        to: "/mock-servers",
        label: "Mock Servers",
        icon: MockIcon,
        countKey: "mockServers",
    },
    {
        to: "/test-suites",
        label: "Test Suites",
        icon: TestIcon,
        countKey: "testSuites",
    },
    {
        to: "/performance",
        label: "Performance",
        icon: ZapIcon,
    },
    {
        to: "/documentation",
        label: "Documentation",
        icon: DocumentationIcon,
    },
];

export const teamItems: StaticSidebarItem[] = [
    {
        to: "/team",
        label: "Team & Comments",
        icon: TeamIcon,
    },
    {
        to: "/settings",
        label: "Settings",
        icon: SettingIcon,
    },
];