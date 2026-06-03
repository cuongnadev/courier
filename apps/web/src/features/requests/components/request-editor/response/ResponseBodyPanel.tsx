import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

import { JsonCodeBlock } from "./JsonCodeBlock";
import { CheckCircleIcon, CopyIcon } from "@/components/common/icons";

const BODY_VIEW_TABS = ["Pretty", "Raw", "Preview"] as const;

type BodyViewTab = (typeof BODY_VIEW_TABS)[number];

type ResponseBodyPanelProps = {
  responseBody: string;
};

function formatJsonIfPossible(value: string) {
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
}

export function ResponseBodyPanel({ responseBody }: ResponseBodyPanelProps) {
  const [activeView, setActiveView] = useState<BodyViewTab>("Pretty");

  const prettyBody = useMemo(
    () => formatJsonIfPossible(responseBody),
    [responseBody],
  );

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <div className="flex items-center justify-between">
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

      {activeView === "Pretty" && (
        <JsonCodeBlock value={prettyBody} mode="pretty" />
      )}

      {activeView === "Raw" && (
        <JsonCodeBlock value={responseBody} mode="raw" />
      )}

      {activeView === "Preview" && (
        <div className="rounded-[12px] border border-[#E5E5E5] bg-white p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-green-700">
            <CheckCircleIcon width={16} height={16} />
            Response received
          </div>

          <pre className="whitespace-pre-wrap break-words text-sm text-[#404040]">
            {prettyBody}
          </pre>
        </div>
      )}
    </div>
  );
}