import type { StaticSidebarItem } from "@/types/common";

export type ToolCountKey =
    | "flows"
    | "mockServers"
    | "testSuites";

export type ToolSidebarItem = StaticSidebarItem & {
    countKey?: ToolCountKey;
};

export type ToolCounts = Partial<Record<ToolCountKey, number>>;