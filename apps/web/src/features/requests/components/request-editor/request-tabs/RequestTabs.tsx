import { Button } from "@/components/ui/button";

import { PlusIcon, SendIcon, XIcon } from "@/components/common/icons";

export type RequestEditorTab = {
  id: string;
  name: string;
};

type RequestTabsProps = {
  tabs: RequestEditorTab[];
  activeRequestId: string;
  onActiveRequestChange?: (requestId: string) => void;
  onCloseRequest?: (requestId: string) => void;
  onAddRequest?: () => void;
};

export function RequestTabs({
  tabs,
  activeRequestId,
  onActiveRequestChange,
  onCloseRequest,
  onAddRequest,
}: RequestTabsProps) {
  return (
    <div className="flex h-12 shrink-0 items-center gap-2 overflow-x-auto border-b-[1.25px] border-[#E5E5E5] bg-[#FAFAFA] px-4">
      {tabs.map((tab) => (
        <RequestTabItem
          key={tab.id}
          tab={tab}
          active={tab.id === activeRequestId}
          onSelect={() => onActiveRequestChange?.(tab.id)}
          onClose={() => onCloseRequest?.(tab.id)}
        />
      ))}

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onAddRequest}
        className="
          h-8 w-8 shrink-0 rounded-[10px]
          bg-transparent text-[#525252]
          shadow-none
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
};

function RequestTabItem({
  tab,
  active,
  onSelect,
  onClose,
}: RequestTabItemProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onSelect}
      className={`
        group h-9 shrink-0 rounded-[12px] px-3 py-1.5
        text-sm font-medium
        shadow-none transition-colors
        focus-visible:ring-0
        focus-visible:ring-offset-0

        ${
          active
            ? "border-[1.25px] border-[#E5E5E5] bg-white text-[#171717] shadow-sm hover:bg-white hover:text-[#171717]"
            : "border border-transparent bg-transparent text-[#525252] hover:border-[#E5E5E5] hover:bg-white hover:text-[#525252]"
        }
      `}
    >
      <span className="flex min-w-0 items-center gap-2">
        {active && (
          <SendIcon width={14} height={14} iconColor="#E17100" />
        )}

        <span className="max-w-[180px] truncate">{tab.name}</span>

        {active && (
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
              bg-transparent p-0
              text-neutral-400
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