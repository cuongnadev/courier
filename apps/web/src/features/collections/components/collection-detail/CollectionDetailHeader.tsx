import { useState } from "react";
import { Button } from "@courier/ui-kit";
import {
  PlusIcon,
  DownloadIcon,
  FolderIcon,
  ShareIcon,
} from "@/components/common/icons";
import {
  ExportCollectionDropdown,
} from "@/features/collections/components/collection-actions";
import { ShareModal } from "@/features/sharing/components/ShareModal";

import type { CollectionDetailResponse } from "@/features/collections/types";

import { formatDate } from "@/lib/utils";
import { collectionBackgroundStyles } from "@/features/collections/utils";
import { createOwnerMember } from "@/features/sharing/utils";

import { useAuthStore } from "@/features/auth/store";
import { CreateRequestModal } from "@/features/requests/components/CreateRequestModal";

type CollectionDetailHeaderProps = {
  collection: CollectionDetailResponse;
  workspaceId: string;
};

export function CollectionDetailHeader({
  collection,
  workspaceId
}: CollectionDetailHeaderProps) {
  const [shareOpen, setShareOpen] = useState(false);
  const [isCreateRequestOpen, setIsCreateRequestOpen] = useState(false);

  const user = useAuthStore(
    (state) => state.user,
  );

  const members = createOwnerMember(user);

  const backgroundColor = collectionBackgroundStyles[collection.color];

  return (
    <>
      <header className="p-6 bg-[#FAFAFA] border-b-[1.25px] border-b-[#E5E5E5]">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div
              className={`
              p-3.5 flex h-14 w-14 items-center justify-center
              rounded-[16px]
              ${backgroundColor}
            `}
            >
              <FolderIcon width={28} height={28} iconColor={collection.color} />
            </div>

            <div>
              <h1 className="text-[24px] font-bold leading-8 text-[#171717]">
                {collection.name}
              </h1>

              {collection.description && (
                <p className="mt-1 text-[16px] font-normal text-[#525252]">
                  {collection.description}
                </p>
              )}

              <div className="mt-4 flex items-center gap-3 text-[14px] text-[#737373]">
                <p>
                  Total Requests:{" "}
                  <span className="font-medium text-[#171717]">
                    {collection.requestsCount}
                  </span>
                </p>

                <p>
                  Created:{" "}
                  <span className="font-medium text-[#171717]">
                    {formatDate(collection.createdAt)}
                  </span>
                </p>

                <p>
                  Last Updated:{" "}
                  <span className="font-medium text-[#171717]">
                    {formatDate(collection.updatedAt)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="h-10 px-4 rounded-[12px] border-[1.25px] border-[#E5E5E5] bg-white hover:bg-neutral-50 text-sm font-medium text-[#1C1917] hover:text-[#1C1917]"
              onClick={() => setShareOpen(true)}
            >
              <ShareIcon width={16} height={16} />
              Share
            </Button>

            <ExportCollectionDropdown collection={collection}>
              <Button
                variant="outline"
                className="h-10 px-4 rounded-[12px] border-[1.25px] border-[#E5E5E5] bg-white hover:bg-neutral-50 text-sm font-medium text-[#1C1917] hover:text-[#1C1917]  data-[state=open]:bg-[#171717] data-[state=open]:text-white"
              >
                <DownloadIcon width={16} height={16} iconColor="currentColor" />
                Export
              </Button>
            </ExportCollectionDropdown>

            <Button 
              onClick={() => setIsCreateRequestOpen(!isCreateRequestOpen)}
              className="h-10 px-4 rounded-[12px] bg-[#155DFC] text-sm font-medium text-white hover:bg-blue-700"
            >
              <PlusIcon width={16} height={16} iconColor="white" />
              Add Request
            </Button>
          </div>
        </div>
      </header>

      <CreateRequestModal
        open={isCreateRequestOpen}
        onOpenChange={setIsCreateRequestOpen}
        workspaceId={workspaceId}
      />

      {shareOpen && (
        <ShareModal
          open={shareOpen}
          onOpenChange={setShareOpen}
          workspaceId= {workspaceId}
          target={{
            id: collection.id,
            name: collection.name,
            type: "collection",
          }}
          members={members}
          onInvite={async (email) => {
            // TODO:
            // call invite collection member api

            console.log(
              "Invite:",
              email,
            );
          }}
          onRemoveMember={async (
            memberId,
          ) => {
            // TODO:
            // call remove collection member api

            console.log(
              "Remove:",
              memberId,
            );
          }}
        />
      )}
    </>
  );
}
