import { Check, ChevronDown, LogOut, Plus } from "lucide-react";

import { SearchInput } from "@/components/forms/search-input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { TooltipCustom } from "@/components/common/tooltip/tooltip-custom";

import {
    ImportIcon,
    ExportIcon,
    SparklesIcon,
    ZapIcon,
    ShareIcon,
    BellIcon
} from "@/components/common/icons";
import { useWorkspaces } from "@/features/workspaces/hooks/use-workspaces";
import { mapWorkspaceHeader } from "@/features/workspaces/utils/map-workspace";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useLogout } from '@/features/auth/hooks/use-logout';

export function Header() {
    const user = useAuthStore((state) => state.user);
    const { data: workspaces = [] } = useWorkspaces();

    const workspaceItems = workspaces.map(mapWorkspaceHeader);

    const currentWorkspace = workspaceItems.find((workspace) => workspace.ownerId === user?.id);

    const { mutate: logout, isPending } = useLogout();

    return (
        <header className="px-6 w-full h-16 flex items-center justify-between border-b-[1.25px] border-[#E5E5E5] bg-white">
            <div className="flex items-center gap-4">
                {/* workspace switcher */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="
                                px-3 py-2 h-10 gap-4 rounded-[12px]
                                border-[1.25px] border-[#E5E5E5]
                                bg-white shadow-none text-neutral-900

                                hover:bg-[#F5F5F5]
                                hover:text-neutral-900
                                hover:border-[#DCDCDC]

                                data-[state=open]:bg-[#F5F5F5]
                                data-[state=open]:text-neutral-900
                                data-[state=open]:border-[#DCDCDC]

                                focus:ring-0
                                focus:outline-none
                                focus:border-[#E5E5E5]

                                focus-visible:ring-0
                                focus-visible:ring-offset-0
                                focus-visible:outline-none
                                focus-visible:border-[#E5E5E5]
                            "
                        >
                            <div className="flex h-6 w-6 items-center justify-center rounded-[4px] bg-[linear-gradient(135deg,#1C1917_0%,#1E2939_100%)] text-xs font-semibold uppercase text-white">
                                {currentWorkspace?.short}
                            </div>

                            <span className="max-w-[180px] truncate text-sm font-medium text-neutral-800">
                                {currentWorkspace?.name}
                            </span>

                            <ChevronDown className="h-4 w-4 text-neutral-500" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="start"
                        className="
                            w-[280px]
                            rounded-xl
                            border border-[#E5E5E5]
                            bg-white
                            p-2
                            text-neutral-900
                            shadow-[0_8px_30px_rgba(0,0,0,0.08)]
                        "
                    >
                        {workspaceItems.map((workspace) => (
                            <DropdownMenuItem
                                key={workspace.id}
                                className="
                                    flex cursor-pointer items-center justify-between rounded-lg px-3 py-2
                                    text-neutral-800 outline-none

                                    hover:bg-[#F5F5F5]
                                    hover:text-neutral-900

                                    focus:bg-[#F5F5F5]
                                    focus:text-neutral-900

                                    data-[highlighted]:bg-[#F5F5F5]
                                    data-[highlighted]:text-neutral-900
                                "
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-900 text-xs font-semibold text-white">
                                        {workspace.short}
                                    </div>

                                    <span className="text-sm font-medium">
                                        {workspace.name}
                                    </span>
                                </div>

                                {workspace.id === currentWorkspace?.id && (
                                    <DropdownMenuShortcut>
                                        <Check className="h-4 w-4 text-neutral-500" />
                                    </DropdownMenuShortcut>
                                )}
                            </DropdownMenuItem>
                        ))}

                        <DropdownMenuSeparator className="bg-[#E5E5E5]" />

                        <DropdownMenuItem
                            className="
                                cursor-pointer rounded-lg px-3 py-2
                                text-neutral-800
                                outline-none

                                hover:bg-[#F5F5F5]
                                hover:text-neutral-900

                                focus:bg-[#F5F5F5]
                                focus:text-neutral-900

                                data-[highlighted]:bg-[#F5F5F5]
                                data-[highlighted]:text-neutral-900
                            "
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Create workspace
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="ps-2 flex items-center gap-1 border-l-[1.25px] border-l-[#E5E5E5]">
                    {/* new workspace */}
                    <TooltipCustom
                        label="New Workspace"
                        side="bottom"
                        align="center"
                        sideOffset={8}
                    >
                        <Button className="h-9 flex items-center rounded-[12px] bg-[#FE9A00] px-3 py-2 hover:bg-amber-400">
                            <Plus className="h-4 w-4" />
                            <span className="text-sm font-medium text-[#101828] leading-[24px]">New</span>
                        </Button>
                    </TooltipCustom>

                    {/* icon actions */}
                    <div className="flex items-center gap-1">
                        {/* Import from Swagger/OpenAPI */}
                        <TooltipCustom
                            label="Import from Swagger/OpenAPI"
                            side="bottom"
                            align="center"
                            sideOffset={8}
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                className="p-2 text-neutral-600 hover:bg-neutral-50 rounded-lg transition-colors"
                            >
                                <ImportIcon />
                            </Button>
                        </TooltipCustom>

                        {/* Export */}

                        <TooltipCustom
                            label="Export"
                            side="bottom"
                            align="center"
                            sideOffset={8}
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                className="p-2 text-neutral-600 hover:bg-neutral-50 rounded-lg transition-colors"
                            >
                                <ExportIcon />
                            </Button>
                        </TooltipCustom>
                    </div>
                </div>
            </div>

            {/* search */}
            <div className="flex-1 max-w-2xl px-8">
                <SearchInput
                    placeholder="Search requests, collections, flows... (⌘K)"
                    shortcut="⌘K"
                    className="w-full gap-3"
                />
            </div>

            <div className="flex items-center gap-4">
                {/* ai assistant */}
                <Button
                    variant="ghost"
                    className="
                        px-3 py-2 h-9 flex items-center gap-2
                        border border-[#F3E8D0] rounded-[12px]
                        bg-amber-50
                        text-sm text-amber-900 font-medium
                        shadow-none
                        transition-colors
                        hover:bg-amber-100
                        hover:text-amber-900
                    "
                >
                    <SparklesIcon />
                    AI Assistant
                </Button>

                {/* actions */}
                <div className="pl-2 h-8 flex items-center gap-1 border-l-[1.25px] border-l-[#E5E5E5]">
                    {/* Run Collection */}
                    <TooltipCustom
                        label="Run Collection"
                        side="bottom"
                        align="center"
                        sideOffset={8}
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="
                                    p-2 rounded-lg
                                    hover:bg-neutral-50
                                "
                        >
                            <ZapIcon iconColor="#525252" />
                        </Button>
                    </TooltipCustom>

                    {/* Share */}
                    <TooltipCustom
                        label="Share"
                        side="bottom"
                        align="center"
                        sideOffset={8}
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="
                                    p-2 rounded-lg
                                    hover:bg-neutral-50
                                "
                        >
                            <ShareIcon />
                        </Button>
                    </TooltipCustom>


                    {/* Notifications */}

                    <TooltipCustom
                        label="Notifications"
                        side="bottom"
                        align="center"
                        sideOffset={8}
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="
                                    relative
                                    p-2 rounded-lg
                                    hover:bg-neutral-50
                                "
                        >
                            <BellIcon />

                            <span
                                className="
                                        absolute right-1.5 top-1.5
                                        h-2 w-2 rounded-full
                                        bg-[#FB2C36]
                                    "
                            />
                        </Button>
                    </TooltipCustom>
                </div>

                {/* profile */}
                <div className="pl-2 h-8 border-l-[1.25px] border-l-[#E5E5E5]">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="
                                    h-8 w-8 rounded-full
                                    overflow-hidden
                                    border-none
                                    bg-transparent p-0
                                    shadow-none

                                    hover:bg-transparent
                                    hover:border-none

                                    data-[state=open]:bg-transparent
                                    data-[state=open]:border-none

                                    focus:ring-0
                                    focus:outline-none
                                    focus:border-none

                                    focus-visible:ring-0
                                    focus-visible:ring-offset-0
                                    focus-visible:outline-none
                                    focus-visible:border-none
                                "
                            >
                                <img
                                    src={
                                        user?.photoUrl ?
                                            user?.photoUrl :
                                            "https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=Sophie"
                                    }
                                    alt="User avatar"
                                    className="h-full w-full rounded-full object-cover"
                                />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="end"
                            sideOffset={10}
                            className="
                                w-[220px]
                                rounded-xl
                                border border-[#E5E5E5]
                                bg-white
                                p-2
                                text-neutral-900
                                shadow-[0_8px_30px_rgba(0,0,0,0.08)]
                            "
                        >
                            <DropdownMenuItem
                                disabled={isPending}
                                onClick={() => logout()}
                                className="
                                    cursor-pointer rounded-lg px-3 py-2
                                    text-red-600 hover:bg-red-50 outline-none

                                    hover:text-red-600

                                    focus:bg-red-50
                                    focus:text-red-600

                                    data-[highlighted]:bg-red-50
                                    data-[highlighted]:text-red-600
                                "
                            >
                                {isPending ? 'Logging out...' : 'Logout'}

                                <DropdownMenuShortcut>
                                    <LogOut className="h-4 w-4 text-red-600" />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}