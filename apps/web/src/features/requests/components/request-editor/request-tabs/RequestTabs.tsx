import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { PlusIcon, SendIcon, XIcon } from "@/components/common/icons";

import type { RequestEditorTab } from "@/features/requests/store/request-editor-tabs.store";

type RequestTabsProps = {
  tabs: RequestEditorTab[];
  activeTabId: string | null;
  onActiveTabChange: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
  onAddTab: () => void;
  onRenameTab: (tabId: string, name: string) => void;
};

export function RequestTabs({
  tabs,
  activeTabId,
  onActiveTabChange,
  onCloseTab,
  onAddTab,
  onRenameTab,
}: RequestTabsProps) {
  return (
    <div className="flex h-12 shrink-0 items-center gap-2 overflow-x-auto border-b-[1.25px] border-[#E5E5E5] bg-[#FAFAFA] px-4 dashboard-scrollbar">
      {tabs.map((tab) => (
        <RequestTabItem
          key={tab.tabId}
          tab={tab}
          active={tab.tabId === activeTabId}
          onSelect={() => onActiveTabChange(tab.tabId)}
          onClose={() => onCloseTab(tab.tabId)}
          onRename={(name) => onRenameTab(tab.tabId, name)}
        />
      ))}

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onAddTab}
        className="
          h-8 w-8 shrink-0 rounded-[10px]
          bg-transparent text-[#525252]
          hover:bg-neutral-100 hover:text-[#171717]
          focus-visible:ring-0
          focus-visible:ring-offset-0
        "
      >
        <PlusIcon width={14} height={14} iconColor="currentColor" />
      </Button>
    </div>
  );
}

type RequestTabItemProps = {
  tab: RequestEditorTab;
  active: boolean;
  onSelect: () => void;
  onClose: () => void;
  onRename: (name: string) => void;
};

function RequestTabItem({
  tab,
  active,
  onSelect,
  onClose,
  onRename,
}: RequestTabItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(tab.name);

  const commitRename = () => {
    const nextName = draftName.trim() || "Untitled Request";

    onRename(nextName);
    setDraftName(nextName);
    setIsEditing(false);
  };

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onSelect}
      className={`
        group h-9 shrink-0 rounded-[12px] px-3 py-1.5
        text-sm font-medium shadow-none transition-colors
        focus-visible:ring-0 focus-visible:ring-offset-0

        ${active
          ? "border-[1.25px] border-[#E5E5E5] bg-white text-[#171717] shadow-sm hover:bg-white hover:text-[#171717]"
          : "border border-transparent bg-transparent text-[#525252] hover:border-[#E5E5E5] hover:bg-white hover:text-[#525252]"
        }
      `}
    >
      <span className="flex min-w-0 items-center gap-2">
        {active && <SendIcon width={14} height={14} iconColor="#E17100" />}

        {isEditing && active ? (
          <Input
            value={draftName}
            autoFocus
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => setDraftName(event.target.value)}
            onBlur={commitRename}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                commitRename();
              }

              if (event.key === "Escape") {
                setDraftName(tab.name);
                setIsEditing(false);
              }
            }}
            className="
              h-6 w-[150px] rounded-md border-[#E5E5E5]
              px-2 text-sm
              focus-visible:ring-0
            "
          />
        ) : (
          <span
            onDoubleClick={(event) => {
              event.stopPropagation();

              if (active) {
                setDraftName(tab.name);
                setIsEditing(true);
              }
            }}
            className="max-w-[180px] truncate"
          >
            {tab.name}
            {tab.isDirty && <span className="ml-1 text-[#A3A3A3]">•</span>}
          </span>
        )}

        {active && !isEditing && (
          <span
            role="button"
            tabIndex={0}
            onClick={(event) => {
              event.stopPropagation();
              onClose();
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                event.stopPropagation();
                onClose();
              }
            }}
            className="
              flex items-center justify-center rounded-md
              bg-transparent p-0 text-neutral-400
              hover:text-neutral-600
            "
          >
            <XIcon width={12} height={12} iconColor="currentColor" />
          </span>
        )}
      </span>
    </Button>
  );
}