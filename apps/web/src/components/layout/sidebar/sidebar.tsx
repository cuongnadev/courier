import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { 
    Logo, 
    HomeIcon, 
    FolderIcon, 
    HistoryIcon, 
    DocumentationIcon, 
    EnvIcon, FlowsIcon, 
    MockIcon, 
    SettingIcon, 
    PerformanceIcon,
    TestIcon,
    TeamIcon
} from "@/components/common/icons";
import { SearchInput } from "@/components/forms/search-input";
import { Button } from "@/components/ui/button";

import { 
    SidebarSection, 
    SidebarItem, 
    SidebarCollectionItem, 
    SidebarSubItem 
} from "@/components/layout/sidebar";

export function Sidebar() {
    const [authOpen, setAuthOpen] = useState(true);
    const [productOpen, setProductOpen] = useState(false);
    const [paymentOpen, setPaymentOpen] = useState(false);

    return (
        <aside className="flex w-63.75 h-screen shrink-0 flex-col border-r-[1.25px] border-[#E5E5E5]">
            {/* logo */}
            <Link to="/" className="pl-3 w-full h-16 flex items-center gap-2 border-b-[1.25px] border-[#E5E5E5]">
                <Logo width={16} height={16} className="w-8 h-8" />
                <h1 className="text-[16px] font-semibold text-[#171717]">Courier</h1>
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
                    <SidebarItem to="/" icon={<HomeIcon iconColor="currentColor" />} label="Dashboard" />
                    <SidebarItem to="/collections" icon={<FolderIcon iconColor="currentColor" />} label="Collections" />
                    <SidebarItem to="/history" icon={<HistoryIcon iconColor="currentColor" />} label="History" />
                </SidebarSection>

                {/* collections */}
                <SidebarSection title="COLLECTIONS" action={<Plus className="size-4 text-[#8A8A8A]" />}>
                    <SidebarCollectionItem
                        icon={<FolderIcon iconColor="#3B82F6" />}
                        label="User Authentication API"
                        count={3}
                        open={authOpen}
                        onToggle={() => setAuthOpen((prev) => !prev)}
                    >
                        <SidebarSubItem to="/collections/auth/login" method="POST" label="User Login" />
                        <SidebarSubItem to="/collections/auth/profile" method="GET" label="Get User Profile" />
                        <SidebarSubItem to="/collections/auth/refresh" method="POST" label="Refresh Token" />
                    </SidebarCollectionItem>

                    <SidebarCollectionItem
                        icon={<FolderIcon iconColor="#10B981" />}
                        label="E-Commerce Products"
                        count={2}
                        open={productOpen}
                        onToggle={() => setProductOpen((prev) => !prev)}
                    />

                    <SidebarCollectionItem
                        icon={<FolderIcon iconColor="#F59E0B" />}
                        label="Payment Gateway"
                        count={1}
                        open={paymentOpen}
                        onToggle={() => setPaymentOpen((prev) => !prev)}
                    />
                </SidebarSection>

                {/* tools */}
                <SidebarSection title="TOOLS">
                    <SidebarItem to="/flows" icon={<FlowsIcon iconColor="currentColor" />} label="Flows" count={2} />
                    <SidebarItem to="/environments" icon={<EnvIcon iconColor="currentColor" />} label="Environments" />
                    <SidebarItem to="/mock-servers" icon={<MockIcon iconColor="currentColor" />} label="Mock Servers" count={1} />
                    <SidebarItem to="/test-suites" icon={<TestIcon iconColor="currentColor" />} label="Test Suites" />
                    <SidebarItem to="/performance" icon={<PerformanceIcon iconColor="currentColor" />} label="Performance" />
                    <SidebarItem to="/documentation" icon={<DocumentationIcon iconColor="currentColor" />} label="Documentation" />
                </SidebarSection>

                {/* team */}
                <SidebarSection title="TEAM">
                    <SidebarItem to="/team" icon={<TeamIcon iconColor="currentColor" />} label="Team & Comments" />
                    <SidebarItem to="/settings" icon={<SettingIcon iconColor="currentColor" />} label="Settings" />
                </SidebarSection>
            </div>

            <div className="border-t border-[#E5E5E5] px-3 py-3.5">
                <p className="text-xs font-medium text-[#737373]">
                    Free Plan
                </p>

                <p className="mt-1 text-xs font-normal text-[#737373]">
                    1,250 / 2,000 requests
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