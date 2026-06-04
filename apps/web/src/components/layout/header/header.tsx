import { useState } from "react";
import {
	Briefcase,
	CircleUser,
	Database,
	FileText,
	Folder,
	FolderPlus,
	GitBranch,
	Server,
} from "lucide-react";

import { SearchInput } from "@/components/forms/SearchInput";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { TooltipCustom } from "@/components/common/tooltip/ToolTipCustom";

import {
	ImportIcon,
	ExportIcon,
	SparklesIcon,
	ZapIcon,
	ShareIcon,
	BellIcon,
	ChevronDownIcon,
	CheckCircleIcon,
	PlusIcon,
	LogOutIcon,
} from "@/components/common/icons";
import { mapWorkspaceHeader } from "@/features/workspaces/utils/map-workspace";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { ProfileDialog } from "@/features/auth/components/ProfileDialog";
import { useSwitchWorkspace } from "@/features/workspaces/hooks/use-switch-workspace";
import { CreateCollectionModal } from "@/features/collections/components/collection-actions";
import { CreateRequestModal } from "@/features/requests/components/CreateRequestModal";
import { CreateWorkspaceModal } from "@/features/workspaces/components";

export function Header() {
	const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false);
	const [isCreateCollectionOpen, setIsCreateCollectionOpen] = useState(false);
	const [isCreateRequestOpen, setIsCreateRequestOpen] = useState(false);
	const [isProfileOpen, setIsProfileOpen] = useState(false);

	const user = useAuthStore((state) => state.user);
	const {
		workspaces,
		currentWorkspace,
		currentWorkspaceId,
		isLoading,
		switchWorkspace,
	} = useSwitchWorkspace();

	const workspaceItems = workspaces.map(mapWorkspaceHeader);

	const currentWorkspaceItem = currentWorkspace
		? mapWorkspaceHeader(currentWorkspace)
		: null;

	const { mutate: logout, isPending } = useLogout();

	return (
		<header className="px-6 w-full h-16 flex items-center justify-between border-b-[1.25px] border-[#E5E5E5] bg-white">
			<div className="flex items-center gap-4">
				{/* workspace switcher */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							disabled={isLoading || workspaces.length === 0}
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
							<div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#1C1917_0%,#1E2939_100%)] text-xs font-semibold uppercase text-white">
								{currentWorkspaceItem?.short}
							</div>

							<span className="max-w-45 truncate text-sm font-medium text-neutral-800">
								{currentWorkspaceItem?.name}
							</span>

							<ChevronDownIcon iconColor="#A1A1A1" />
						</Button>
					</DropdownMenuTrigger>

					<DropdownMenuContent
						align="start"
						className="
                            w-70
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
								onSelect={() => switchWorkspace(workspace.id)}
								className="
                                    flex cursor-pointer items-center justify-between rounded-lg px-3 py-2
                                    text-neutral-800 outline-none

                                    hover:bg-[#F5F5F5]
                                    hover:text-neutral-900

                                    focus:bg-[#F5F5F5]
                                    focus:text-neutral-900

                                    data-highlighted:bg-[#F5F5F5]
                                    data-highlighted:text-neutral-900
                                "
							>
								<div className="flex items-center gap-3 overflow-hidden">
									<div
										className="
                                        flex h-8 w-8 shrink-0 items-center justify-center 
                                        rounded-md bg-neutral-900 text-xs font-semibold text-white
                                    "
									>
										{workspace.short}
									</div>

									<span className="text-sm font-medium truncate">
										{workspace.name}
									</span>
								</div>

								{workspace.id === currentWorkspaceId && (
									<DropdownMenuShortcut>
										<CheckCircleIcon />
									</DropdownMenuShortcut>
								)}
							</DropdownMenuItem>
						))}

						<DropdownMenuSeparator className="bg-[#E5E5E5]" />

						<DropdownMenuItem
							onSelect={() => setIsCreateWorkspaceOpen(true)}
							className="
                                cursor-pointer rounded-lg px-3 py-2
                                text-neutral-800
                                outline-none

                                hover:bg-[#F5F5F5]
                                hover:text-neutral-900

                                focus:bg-[#F5F5F5]
                                focus:text-neutral-900

                                data-highlighted:bg-[#F5F5F5]
                                data-highlighted:text-neutral-900
                            "
						>
							<PlusIcon iconColor="currentColor" />
							Create workspace
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				<div className="ps-2 flex items-center gap-1 border-l-[1.25px] border-l-[#E5E5E5]">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button className="h-9 flex items-center rounded-[12px] bg-[#FE9A00] px-3 py-2 hover:bg-amber-400">
								<PlusIcon iconColor="#101828" />
								<span className="text-sm font-medium text-[#101828] leading-6">
									New
								</span>
							</Button>
						</DropdownMenuTrigger>

						<DropdownMenuContent
							align="start"
							sideOffset={10}
							className="
                                w-65
                                rounded-[16px]
                                border border-[#E5E5E5]
                                bg-white
                                p-0
                                text-neutral-900
                                shadow-[0_8px_30px_rgba(0,0,0,0.08)]
                            "
						>
							<div className="px-4 pb-2 pt-4 text-xs font-semibold uppercase tracking-[0.04em] text-[#737373]">
								Create New
							</div>

							<div className="px-2 pb-2">
								<DropdownMenuItem
									onSelect={() =>
										setIsCreateWorkspaceOpen(true)
									}
									className="h-10 cursor-pointer rounded-lg px-3 text-sm font-medium text-[#404040] outline-none hover:bg-[#F5F5F5] focus:bg-[#F5F5F5] data-highlighted:bg-[#F5F5F5]"
								>
									<Briefcase size={18} strokeWidth={1.8} />
									Workspace
								</DropdownMenuItem>

								<DropdownMenuItem
									onSelect={() =>
										setIsCreateCollectionOpen(true)
									}
									className="h-10 cursor-pointer rounded-lg px-3 text-sm font-medium text-[#404040] outline-none hover:bg-[#F5F5F5] focus:bg-[#F5F5F5] data-highlighted:bg-[#F5F5F5]"
								>
									<FolderPlus size={18} strokeWidth={1.8} />
									Collection
								</DropdownMenuItem>

								<DropdownMenuItem
									onSelect={() =>
										setIsCreateRequestOpen(true)
									}
									className="h-10 cursor-pointer rounded-lg px-3 text-sm font-medium text-[#404040] outline-none hover:bg-[#F5F5F5] focus:bg-[#F5F5F5] data-highlighted:bg-[#F5F5F5]"
								>
									<FileText size={18} strokeWidth={1.8} />
									Request
								</DropdownMenuItem>

								<DropdownMenuItem className="h-10 cursor-pointer rounded-lg px-3 text-sm font-medium text-[#404040] outline-none hover:bg-[#F5F5F5] focus:bg-[#F5F5F5] data-highlighted:bg-[#F5F5F5]">
									<Folder size={18} strokeWidth={1.8} />
									Folder
								</DropdownMenuItem>
							</div>

							<DropdownMenuSeparator className="m-0 bg-[#E5E5E5]" />

							<div className="px-2 py-2">
								<DropdownMenuItem className="h-10 cursor-pointer rounded-lg px-3 text-sm font-medium text-[#404040] outline-none hover:bg-[#F5F5F5] focus:bg-[#F5F5F5] data-highlighted:bg-[#F5F5F5]">
									<Database size={18} strokeWidth={1.8} />
									Environment
								</DropdownMenuItem>

								<DropdownMenuItem className="h-10 cursor-pointer rounded-lg px-3 text-sm font-medium text-[#404040] outline-none hover:bg-[#F5F5F5] focus:bg-[#F5F5F5] data-highlighted:bg-[#F5F5F5]">
									<GitBranch size={18} strokeWidth={1.8} />
									Flow
								</DropdownMenuItem>

								<DropdownMenuItem className="h-10 cursor-pointer rounded-lg px-3 text-sm font-medium text-[#404040] outline-none hover:bg-[#F5F5F5] focus:bg-[#F5F5F5] data-highlighted:bg-[#F5F5F5]">
									<Server size={18} strokeWidth={1.8} />
									Mock Server
								</DropdownMenuItem>
							</div>
						</DropdownMenuContent>
					</DropdownMenu>

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
							className="p-2 rounded-lg hover:bg-neutral-50">
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
							className="p-2 rounded-lg hover:bg-neutral-50">
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
							className="relative p-2 rounded-lg hover:bg-neutral-50">
							<BellIcon />
							<span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#FB2C36]"/>
						</Button>
					</TooltipCustom>
				</div>

				{/* profile */}
				<div className="pl-2 h-8 border-l-[1.25px] border-l-[#E5E5E5]">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								className=" h-8 w-8 rounded-full overflow-hidden border-none bg-transparent p-0 shadow-none hover:bg-transparent hover:border-none data-[state=open]:bg-transparent data-[state=open]:border-none focus:ring-0 focus:outline-none focus:border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus-visible:border-none">
								<img
									src={
										user?.photoUrl
											? user?.photoUrl
											: "https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=Sophie"
									}
									alt="User avatar"
									className="h-full w-full rounded-full object-cover"
								/>
							</Button>
						</DropdownMenuTrigger>

						<DropdownMenuContent
							align="end"
							sideOffset={10}
							className=" w-55 rounded-xl borderborder-[#E5E5E5] bg-white p-2 text-neutral-900 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
							<DropdownMenuItem
								onSelect={() => setIsProfileOpen(true)}
								className="
                  cursor-pointer rounded-lg px-3 py-2
                  text-neutral-800 outline-none

                  hover:bg-[#F5F5F5]
                  hover:text-neutral-900

                  focus:bg-[#F5F5F5]
                  focus:text-neutral-900

                  data-highlighted:bg-[#F5F5F5]
                  data-highlighted:text-neutral-900
                "
							>
								Profile
								<DropdownMenuShortcut>
									<CircleUser size={17} />
								</DropdownMenuShortcut>
							</DropdownMenuItem>

							<DropdownMenuSeparator className="bg-[#E5E5E5]" />

							<DropdownMenuItem
								disabled={isPending}
								onClick={() => logout()}
								className="
                                    cursor-pointer rounded-lg px-3 py-2
                                    text-red-600 hover:bg-red-50 outline-none

                                    hover:text-red-600

                                    focus:bg-red-50
                                    focus:text-red-600

                                    data-highlighted:bg-red-50
                                    data-highlighted:text-red-600
                                "
							>
								{isPending ? "Logging out..." : "Logout"}

								<DropdownMenuShortcut>
									<LogOutIcon iconColor="#EF4444" />
								</DropdownMenuShortcut>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			<CreateWorkspaceModal
				open={isCreateWorkspaceOpen}
				onOpenChange={setIsCreateWorkspaceOpen}
			/>

			<CreateCollectionModal
				open={isCreateCollectionOpen}
				onOpenChange={setIsCreateCollectionOpen}
				workspaceId={currentWorkspaceId ?? undefined}
			/>

			<CreateRequestModal
				open={isCreateRequestOpen}
				onOpenChange={setIsCreateRequestOpen}
				workspaceId={currentWorkspaceId}
			/>

			<ProfileDialog
				open={isProfileOpen}
				onOpenChange={setIsProfileOpen}
				user={user}
				workspaceId={currentWorkspaceId}
			/>
		</header>
	);
}
