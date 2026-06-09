import { useMemo, useState } from "react";

import { Button } from "@repo/ui";

import { JsonCodeBlock } from "./JsonCodeBlock";
import { ResponsePreviewPanel } from "./ResponsePreviewPanel";
import { CopyIcon } from "@/components/common/icons";

const BODY_VIEW_TABS = ["Pretty", "Raw", "Preview"] as const;

type BodyViewTab = (typeof BODY_VIEW_TABS)[number];

type ResponseBodyPanelProps = {
  responseBody: string;
  responseUrl?: string;
};

function formatJsonIfPossible(value: string) {
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
}

export function ResponseBodyPanel({
  responseBody,
  responseUrl,
}: ResponseBodyPanelProps) {
  const [activeView, setActiveView] = useState<BodyViewTab>("Pretty");

  const prettyBody = useMemo(
    () => formatJsonIfPossible(responseBody),
    [responseBody],
  );

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <div className="flex shrink-0 items-center justify-between">
        <div className="flex gap-2">
          {BODY_VIEW_TABS.map((tab) => {
            const isActive = activeView === tab;

            return (
              <Button
                key={tab}
                type="button"
                variant="ghost"
                onClick={() => setActiveView(tab)}
                className={`
                  h-8 rounded-[6px] px-4 text-xs font-medium
                  shadow-none
                  focus-visible:ring-0
                  focus-visible:ring-offset-0

                  ${
                    isActive
                      ? "border-[1.25px] border-[#E5E5E5] bg-white text-[#1C1917] hover:bg-white hover:text-[#1C1917]"
                      : "border border-transparent bg-transparent text-[#525252] hover:bg-white hover:text-[#525252]"
                  }
                `}
              >
                {tab}
              </Button>
            );
          })}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="
            rounded-[4px] p-1.5
            hover:bg-white
            focus-visible:ring-0
            focus-visible:ring-offset-0
          "
        >
          <CopyIcon width={16} height={16} iconColor="#525252" />
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        {activeView === "Pretty" && (
          <JsonCodeBlock value={prettyBody} mode="pretty" />
        )}

        {activeView === "Raw" && (
          <JsonCodeBlock value={responseBody} mode="raw" />
        )}

        {activeView === "Preview" && (
          <ResponsePreviewPanel
            responseBody={responseBody}
            responseUrl={responseUrl}
          />
        )}
      </div>
    </div>
  );
}
