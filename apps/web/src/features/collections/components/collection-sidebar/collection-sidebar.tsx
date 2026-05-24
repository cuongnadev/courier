import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/forms/search-input";
import { UploadIcon, PlusIcon } from "@/components/common/icons";
import { TooltipCustom } from "@/components/common/tooltip/tooltip-custom";
import { CollectionSidebarList } from "./collection-sidebar-list";

import { useCollections } from "@/features/collections/hooks/use-collections";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useWorkspaces } from "@/features/workspaces/hooks/use-workspaces";

type CollectionSidebarProps = {
  selectedCollectionId?: string | null;
  onSelectCollection?: (collectionId: string) => void;
};

export default function CollectionSidebar({
  selectedCollectionId,
  onSelectCollection,
}: CollectionSidebarProps) {
  const user = useAuthStore((state) => state.user);
  const { data: workspaces = [] } = useWorkspaces();

  const currentWorkspace = workspaces.find((workspace) => workspace.ownerId === user?.id);

  const { data: collections = [], isLoading } = useCollections(currentWorkspace?.id);

  const activeCollectionId =
    selectedCollectionId ?? collections[0]?.id ?? "";

  return (
    <aside className="w-[320px] bg-white border-r-[1.25px] border-r-[#E5E5E5]">
      <div className="p-4 flex flex-col gap-3 border-b-[1.25px] border-b-[#E5E5E5]">
        <div className="flex items-center justify-between">
          <h1 className="text-[20px] font-semibold text-[#171717]">Collections</h1>

          <div className="flex items-center gap-1">
            <TooltipCustom
              label="Import"
              side="bottom"
              sideOffset={8}
            >
              <Button className="p-2 rounded-[12px] bg-transparent hover:bg-neutral-100">
                <UploadIcon iconColor="#525252" />
              </Button>
            </TooltipCustom>

            <TooltipCustom
              label="New Collection"
              side="bottom"
              sideOffset={8}
            >
              <Button className="p-2 rounded-[12px] bg-transparent hover:bg-amber-50">
                <PlusIcon iconColor="#E17100" />
              </Button>
            </TooltipCustom>
          </div>
        </div>
        <SearchInput
          placeholder="Search collections..."
          className="w-full"
        />
      </div>
      <div className="p-2 flex items-start justify-center">
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading collections...</p>
        ) : collections.length === 0 ? (
          <p className="text-sm text-gray-500">No collections found.</p>
        ) : (
          <CollectionSidebarList
            collections={collections}
            activeCollectionId={activeCollectionId}
            onSelectCollection={onSelectCollection}
          />
        )}
      </div>
    </aside>
  );
}