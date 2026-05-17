import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { SearchInput } from "@/components/forms/search-input";
import { Button } from "@/components/ui/button";
import { WORKSPACEITEMS, TOOLITEMS, TEAMITEMS } from "@/constants/sidebar";

import {
    Logo,
    FolderIcon,
} from "@/components/common/icons";

import {
    SidebarSection,
    SidebarItem,
    SidebarCollectionItem,
    SidebarSubItem
} from "@/components/layout/sidebar";

import type { CollectionVariant } from "@/features/collections/types/collection.type";

import { useAuthStore } from "@/features/auth/store/auth.store";
import { useToolCounts } from "@/features/tools/hooks/use-tool-counts";
import { useWorkspaces } from "@/features/workspaces/hooks/use-workspaces";
import { useCollectionSidebar } from "@/features/collections/hooks/use-collections-sidebar";

// Fake data for now, replace with backend response later
const currentPlan = {
    name: "Free Plan",
    usedRequests: 1250,
    totalRequests: 2000,
};

export function Sidebar() {
    const user = useAuthStore((state) => state.user);
    const { data: workspaces = [] } = useWorkspaces();

    const currentWorkspace = workspaces.find((workspace) => workspace.ownerId === user?.id);

    const {
        collections,
        openCollections,
        toggleCollection,
    } = useCollectionSidebar(currentWorkspace?.id);

    const { toolCounts } = useToolCounts(currentWorkspace?.id);

    return (
        <aside className="flex w-63.75 h-screen shrink-0 flex-col border-r-[1.25px] border-[#E5E5E5]">
            {/* logo */}
            <Link to="/" className="pl-3 w-full h-16 flex items-center gap-2 border-b-[1.25px] border-[#E5E5E5]">
                <Logo width={16} height={16} className="w-8 h-8" />
                <h2 className="text-[16px] font-semibold text-[#171717]">Courier</h2>
            </Link>

            {/* search */}
            <div className="p-3 w-full h-16 border-b-[1.25px] border-[#E5E5E5]">
                <SearchInput
                    placeholder="Search requests..."
                    className="w-full gap-2"
                />
            </div>

            <div className="
                flex-1 overflow-y-auto
                custom-scrollbar
            "
            >
                {/* workspace */}
                <SidebarSection title="WORKSPACE">
                    {WORKSPACEITEMS.map((item) => {
                        const Icon = item.icon;

                        return (
                            <SidebarItem
                                key={item.to}
                                to={item.to}
                                icon={<Icon iconColor="currentColor" />}
                                label={item.label}
                            />
                        );
                    })}
                </SidebarSection>

                {/* collections */}
                <SidebarSection title="COLLECTIONS" action={<Plus className="size-4 text-[#8A8A8A]" />}>
                    {collections.map((collection) => {
                        const collectionVariantStyles: Record<
                            CollectionVariant,
                            {
                                iconColor: string;
                            }
                        > = {
                            blue: {
                                iconColor: "#3B82F6",
                            },

                            green: {
                                iconColor: "#10B981",
                            },

                            orange: {
                                iconColor: "#F59E0B",
                            },

                            purple: {
                                iconColor: "#8B5CF6",
                            },

                            red: {
                                iconColor: "#EF4444",
                            },

                            pink: {
                                iconColor: "#EC4899",
                            },
                        };

                        return (
                            <SidebarCollectionItem
                                key={collection.id}
                                icon={<FolderIcon iconColor={collectionVariantStyles[collection.variant].iconColor} />}
                                label={collection.name}
                                count={collection.requests.length}
                                open={Boolean(openCollections[collection.id])}
                                onToggle={() => toggleCollection(collection.id)}
                            >
                                {collection.requests.map((request) => (
                                    <SidebarSubItem
                                        key={request.id}
                                        to={request.uri}
                                        method={request.method}
                                        label={request.name}
                                    />
                                ))}
                            </SidebarCollectionItem>
                        );
                    })}
                </SidebarSection>

                {/* tools */}
                <SidebarSection title="TOOLS">
                    {TOOLITEMS.map((item) => {
                        const Icon = item.icon;

                        return (
                            <SidebarItem
                                key={item.to}
                                to={item.to}
                                icon={<Icon iconColor="currentColor" />}
                                label={item.label}
                                count={item.countKey ? toolCounts[item.countKey] : undefined}
                            />
                        );
                    })}
                </SidebarSection>

                {/* team */}
                <SidebarSection title="TEAM">
                    {TEAMITEMS.map((item) => {
                        const Icon = item.icon;

                        return (
                            <SidebarItem
                                key={item.to}
                                to={item.to}
                                icon={<Icon iconColor="currentColor" />}
                                label={item.label}
                            />
                        );
                    })}
                </SidebarSection>
            </div>

            {/* plan info */}
            <div className="border-t border-[#E5E5E5] px-3 py-3.5">
                <p className="text-xs font-medium text-[#737373]">
                    {currentPlan.name}
                </p>

                <p className="mt-1 text-xs font-normal text-[#737373]">
                    {currentPlan.usedRequests.toLocaleString()} /{" "}
                    {currentPlan.totalRequests.toLocaleString()} requests
                </p>

                <Button
                    onClick={() => alert("Upgrade to Pro")}
                    className="
                        mt-2 h-11 w-full rounded-[12px]
                        bg-[#FFFBEB]
                        text-xs font-medium text-[#7B3306]
                        transition-colors
                        hover:bg-amber-100
                    "
                >
                    Upgrade to Pro
                </Button>
            </div>
        </aside>
    );
}