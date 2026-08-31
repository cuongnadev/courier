import { useMemo, useState } from "react";

import { Button } from "@courier/ui-kit";
import { SearchInput } from "@/features/search/components";
import { UploadIcon, PlusIcon } from "@/components/common/icons";
import { TooltipCustom } from "@/components/common/tooltip/ToolTipCustom";
import { CollectionSidebarList } from "@/features/collections/components/collection-sidebar";
import {
  CreateCollectionModal,
  ImportApisModal,
  EditCollectionModal,
  DeleteCollectionDialog,
} from "@/features/collections/components/collection-actions";

import {
  useCollections,
  useDeleteCollection,
  useImportCollection,
  useUpdateCollection,
} from "@/features/collections/hooks";
import { useCurrentWorkspace } from "@/features/workspaces/hooks";

import type { CollectionResponse } from "@/features/collections/types";

import { parseImportFile } from "@/features/collections/utils";

type CollectionSidebarProps = {
  selectedCollectionId?: string | null;
  onSelectCollection?: (collectionId: string) => void;
};

export function CollectionSidebar({
  selectedCollectionId,
  onSelectCollection,
}: CollectionSidebarProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingCollection, setEditingCollection] =
    useState<CollectionResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [deletingCollection, setDeletingCollection] =
    useState<CollectionResponse | null>(null);
  const { currentWorkspaceId } = useCurrentWorkspace();

  const importCollectionMutation = useImportCollection(currentWorkspaceId);
  const updateCollectionMutation = useUpdateCollection({
    workspaceId: currentWorkspaceId,
  });

  const deleteCollectionMutation = useDeleteCollection({
    workspaceId: currentWorkspaceId,
  });

  const { data: collections = [], isLoading } =
    useCollections(currentWorkspaceId);

  const filteredCollections = useMemo(() => {
    const query = searchQuery.toLowerCase();

    if (!query) return collections;

    return collections.filter((collection) =>
      collection.name.toLowerCase().includes(query),
    );
  }, [collections, searchQuery]);
    
  const activeCollectionId = selectedCollectionId ?? "";

  return (
    <>
      <aside className="flex h-full min-h-0 w-[320px] shrink-0 flex-col border-r-[1.25px] border-r-[#E5E5E5] bg-white">
        <div className="p-4 flex flex-col gap-3 border-b-[1.25px] border-b-[#E5E5E5]">
          <div className="flex items-center justify-between">
            <h1 className="text-[20px] font-semibold text-[#171717]">
              Collections
            </h1>

            <div className="flex items-center gap-1">
              <TooltipCustom label="Import" side="bottom" sideOffset={8}>
                <Button
                  className="p-2 rounded-[12px] bg-transparent hover:bg-neutral-100"
                  onClick={() => setIsImportOpen(true)}
                >
                  <UploadIcon iconColor="#525252" />
                </Button>
              </TooltipCustom>

              <TooltipCustom
                label="New Collection"
                side="bottom"
                sideOffset={8}
              >
                <Button
                  className="p-2 rounded-[12px] bg-transparent hover:bg-amber-50"
                  onClick={() => setIsCreateOpen(true)}
                >
                  <PlusIcon iconColor="#E17100" />
                </Button>
              </TooltipCustom>
            </div>
          </div>
          <SearchInput 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search collections..." 
            containerClassName="w-full" 
          />
        </div>
        <div className="min-h-0 flex-1 flex justify-center overflow-y-auto p-2 dashboard-scrollbar">
          {isLoading ? (
            <p className="text-sm text-gray-500">Loading collections...</p>
          ) : collections.length === 0 ? (
            <p className="text-sm text-gray-500">No collections yet.</p>
          ) : filteredCollections.length === 0 ? (
            <p className="px-2 py-4 text-center text-sm text-gray-500">
              No collections found.
            </p>
          ) : (
            <CollectionSidebarList
              searchQuery={searchQuery}
              collections={filteredCollections}
              activeCollectionId={activeCollectionId}
              onSelectCollection={onSelectCollection}
              onEditCollection={setEditingCollection}
              onDeleteCollection={setDeletingCollection}
            />
          )}
        </div>
      </aside>

      {isCreateOpen && (
        <CreateCollectionModal
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          workspaceId={currentWorkspaceId}
        />
      )}

      {isImportOpen && (
        <ImportApisModal
          open={isImportOpen}
          onOpenChange={setIsImportOpen}
          onImport={async (file) => {
            const payload = await parseImportFile(file);

            await importCollectionMutation.mutateAsync(payload);
          }}
        />
      )}

      <EditCollectionModal
        open={Boolean(editingCollection)}
        onOpenChange={(open) => {
          if (!open) setEditingCollection(null);
        }}
        collection={editingCollection}
        isPending={updateCollectionMutation.isPending}
        onSubmit={async (data) => {
          if (!editingCollection) return;

          await updateCollectionMutation.mutateAsync({
            collectionId: editingCollection.id,
            data,
          });

          setEditingCollection(null);
        }}
      />

      <DeleteCollectionDialog
        open={Boolean(deletingCollection)}
        onOpenChange={(open) => {
          if (!open) setDeletingCollection(null);
        }}
        collection={deletingCollection}
        isPending={deleteCollectionMutation.isPending}
        onConfirm={async () => {
          if (!deletingCollection) return;

          await deleteCollectionMutation.mutateAsync({
            collectionId: deletingCollection.id,
          });

          setDeletingCollection(null);
        }}
      />
    </>
  );
}
