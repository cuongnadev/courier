import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@courier/ui-kit";

import { SearchInput } from "./SearchInput";
import { SearchList } from "./SearchList";
import { SearchEmpty } from "./SearchEmpty";

import {
  useSearchDialog,
  useSearchShortcut,
  useSearchKeyboard,
  useGlobalSearch,
} from "@/features/search/hooks";

import { normalizeSearchItems } from "@/features/search/utils";

import type { SearchItem } from "@/features/search/types";

import { useCollections } from "@/features/collections/hooks";
import { useCurrentWorkspace } from "@/features/workspaces/hooks";

import { ROUTE_TO } from "@/constants/route-paths";

export function GlobalSearchDialog() {
  useSearchShortcut();

  const navigate = useNavigate();

  const { open, closeDialog } = useSearchDialog();

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const { currentWorkspaceId } = useCurrentWorkspace();

  const {
    data: collections = [],
    isLoading,
  } = useCollections(currentWorkspaceId);

  const items = useMemo(
    () => normalizeSearchItems(collections),
    [collections],
  );

  const {
    results,
    hasQuery,
    isEmpty,
  } = useGlobalSearch({
    query,
    items,
  });

  const handleQueryChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      setActiveIndex(0);
    },
    [],
  );

  const handleClose = useCallback(() => {
    setQuery("");
    setActiveIndex(0);
    closeDialog();
  }, [closeDialog]);

  const handleSelect = useCallback(
    (item: SearchItem) => {
      handleClose();

      if (item.type === "collection") {
        navigate({
          to: ROUTE_TO.WORKSPACE_COLLECTION_DETAIL,
          params: {
            workspaceId: currentWorkspaceId!,
            collectionId: item.id,
          },
        });

        return;
      }

      navigate({
        to: ROUTE_TO.WORKSPACE_REQUEST_DETAIL,
        params: {
          workspaceId: currentWorkspaceId!,
          collectionId: item.collectionId!,
          requestId: item.id,
        },
      });
    },
    [currentWorkspaceId, navigate, handleClose],
  );

  const orderedResults = useMemo(() => {
    const collections = results.filter(
      (item) => item.type === "collection",
    );

    const requests = results.filter(
      (item) => item.type === "request",
    );

    return [...collections, ...requests];
  }, [results]);

  useSearchKeyboard({
    enabled: hasQuery && results.length > 0,
    results: orderedResults,
    activeIndex,
    onActiveIndexChange: setActiveIndex,
    onSelect: handleSelect,
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleClose();
        }
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="
          !w-[calc(100vw-64px)]
          !max-w-[960px]

          flex
          h-[700px]
          flex-col

          gap-0
          overflow-hidden

          rounded-[20px]
          border border-[#E5E5E5]

          bg-white
          p-0

          shadow-[0_24px_80px_rgba(0,0,0,0.18)]

          [&_[data-slot=dialog-close]]:text-[#737373]
          [&_[data-slot=dialog-close]]:hover:bg-neutral-100
          [&_[data-slot=dialog-close]]:hover:text-[#171717]
        "
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Global Search</DialogTitle>
        </DialogHeader>

        {/* Header */}
        <div className="border-b border-neutral-200 px-6 py-5">
          <SearchInput
            autoFocus
            value={query}
            onChange={handleQueryChange}
            placeholder="Search requests, collections, flows..."
            containerClassName="
              h-12
              w-full
              rounded-2xl
              border-neutral-300
              bg-neutral-50
            "
          />
        </div>

        {/* Content */}
        <div className="custom-scrollbar flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex h-full flex-col items-center justify-center gap-4">
              <Loader2 className="size-6 animate-spin text-neutral-500" />

              <p className="text-sm text-neutral-500">
                Loading workspace...
              </p>
            </div>
          ) : isEmpty || !hasQuery ? (
            <SearchEmpty hasQuery={hasQuery} />
          ) : (
            <SearchList
              items={orderedResults}
              activeIndex={activeIndex}
              onSelect={handleSelect}
            />
          )}
        </div>

        {/* Footer */}
        <div
          className="
            flex
            items-center
            justify-between

            border-t
            border-neutral-200

            bg-white

            px-6
            py-3
          "
        >
          <div className="flex items-center gap-6">
            <FooterShortcut
              keyLabel="↑↓"
              label="Navigate"
            />

            <FooterShortcut
              keyLabel="↵"
              label="Open"
            />
          </div>

          <FooterShortcut
            keyLabel="Esc"
            label="Close"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}


type FooterShortcutProps = {
  keyLabel: string;
  label: string;
};

function FooterShortcut({
  keyLabel,
  label,
}: FooterShortcutProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-neutral-500">
      <kbd
        className="
          min-w-8
          rounded-md
          border
          border-neutral-300

          bg-neutral-50

          px-2
          py-1

          text-center
          text-xs
          font-medium
          text-neutral-700

          shadow-sm
        "
      >
        {keyLabel}
      </kbd>

      <span>{label}</span>
    </div>
  );
}