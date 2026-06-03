import { useState } from "react";

import type { RequestRunResponse } from "@/features/requests/types/request-run.type";

import { Button } from "@/components/ui/button";
import { XIcon } from "@/components/common/icons";

import { ResponseBodyPanel } from "./ResponseBodyPanel";
import { ResponseHeadersPanel } from "./ResponseHeadersPanel";
import { ResponseCookiesPanel } from "./ResponseCookiesPanel";
import { ResponseSchemaValidationPanel } from "./ResponseSchemaValidationPanel";
import { ResponseRawPanel } from "./ResponseRawPanel";

const RESPONSE_TABS = [
  { value: "body", label: "Body" },
  { value: "headers", label: "Headers", count: 0 },
  { value: "cookies", label: "Cookies", count: 0 },
  { value: "schema-validation", label: "Schema Validation" },
  { value: "raw", label: "Raw" },
] as const;

type ResponseTabValue = (typeof RESPONSE_TABS)[number]["value"];

type ResponsePanelProps = {
  response: RequestRunResponse | null;
  isSending?: boolean;
};

export function ResponsePanel({
  response,
  isSending,
}: ResponsePanelProps) {
  const [activeTab, setActiveTab] = useState<ResponseTabValue>("body");

  const hasResponse = Boolean(response);

  return (
    <aside className="flex h-full min-h-0 w-[520px] shrink-0 flex-col bg-white">
      <div className="flex shrink-0 flex-col gap-3 border-b-[1.25px] border-[#E5E5E5] p-4">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-lg font-semibold text-[#171717]">Response</h2>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="
              h-6 w-6 rounded-[4px]
              hover:bg-neutral-100
              focus-visible:ring-0
              focus-visible:ring-offset-0
            "
          >
            <XIcon width={16} height={16} iconColor="#525252" />
          </Button>
        </div>

        {hasResponse ? (
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div>
              <span className="text-[#737373]">Status:</span>

              <span className="ml-[3px] rounded-[4px] bg-[#DCFCE7] px-2 py-1 font-semibold text-[#008236]">
                {response?.statusCode ?? "-"}
              </span>
            </div>

            <div>
              <span className="text-[#737373]">Time:</span>
              <span className="ml-[3px] font-semibold text-[#171717]">
                {response?.durationMs ?? "-"}ms
              </span>
            </div>

            <div>
              <span className="text-[#737373]">Size:</span>
              <span className="ml-[3px] font-semibold text-[#171717]">
                {response?.responseSize ?? 0}B
              </span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-[#737373]">
            {isSending ? "Sending request..." : "Send a request to see the response."}
          </p>
        )}
      </div>

      {hasResponse ? (
        <>
          <div className="flex h-12 shrink-0 items-center border-b-[1.25px] border-[#E5E5E5] bg-white">
            {RESPONSE_TABS.map((tab) => {
              const isActive = activeTab === tab.value;

              return (
                <Button
                  key={tab.value}
                  type="button"
                  variant="ghost"
                  onClick={() => setActiveTab(tab.value)}
                  className={`
                    relative h-full rounded-none bg-transparent px-5 py-0
                    text-sm font-medium shadow-none
                    hover:bg-transparent
                    focus-visible:ring-0
                    focus-visible:ring-offset-0

                    ${isActive
                      ? "text-[#E17100] hover:text-[#E17100]"
                      : "text-[#404040] hover:text-[#171717]"
                    }
                  `}
                >
                  <span>
                    {tab.label}

                    {"count" in tab && (
                      <span className="ml-1 text-xs text-[#A3A3A3]">
                        ({tab.count})
                      </span>
                    )}
                  </span>

                  {isActive && (
                    <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#155DFC]" />
                  )}
                </Button>
              );
            })}
          </div>

          <div className="min-h-0 flex-1 overflow-auto p-5">
            {activeTab === "body" && (
              <ResponseBodyPanel responseBody={response?.responseBody ?? ""} />
            )}

            {activeTab === "headers" && <ResponseHeadersPanel />}
            {activeTab === "cookies" && <ResponseCookiesPanel />}
            {activeTab === "schema-validation" && (
              <ResponseSchemaValidationPanel />
            )}
            {activeTab === "raw" && response && (
              <ResponseRawPanel response={response} />
            )}
          </div>
        </>
      ) : (
        <div className="flex min-h-0 flex-1 items-center justify-center p-6">
          <div className="rounded-[16px] border border-dashed border-[#E5E5E5] bg-[#FAFAFA] px-6 py-8 text-center">
            <p className="text-sm font-medium text-[#171717]">
              No response yet
            </p>
            <p className="mt-1 text-sm text-[#737373]">
              Click Send to execute this request.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}