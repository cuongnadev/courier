import { useState } from "react";

import type { RunRequestPayload } from "@/features/requests/types/request-run-payload.type";
import { Button } from "@/components/ui/button";

import { ParamsPanel } from "./ParamsPanel";
import { AuthorizationPanel } from "./AuthorizationPanel";
import { HeadersPanel } from "./HeadersPanel";
import { BodyPanel } from "./BodyPanel";
import { PreRequestScriptPanel } from "./PreRequestScriptPanel";
import { TestsPanel } from "./TestsPanel";

const REQUEST_TABS = [
  "Params",
  "Authorization",
  "Headers",
  "Body",
  "Pre-request Script",
  "Tests",
] as const;

type RequestTab = (typeof REQUEST_TABS)[number];

type RequestEditorTabsProps = {
  workspaceId: string;
  collectionId: string;
  requestId: string | null;

  payload: RunRequestPayload;
  onPayloadChange: React.Dispatch<React.SetStateAction<RunRequestPayload>>;
};

export function RequestEditorTabs({
  workspaceId,
  collectionId,
  requestId,

  payload,
  onPayloadChange,
}: RequestEditorTabsProps) {
  const [activeTab, setActiveTab] = useState<RequestTab>("Body");

  const headersCount = payload.headers.filter((header) => header.enabled).length;

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <div className="flex h-14 shrink-0 items-center gap-6 border-b border-[#E5E5E5] px-5">
        {REQUEST_TABS.map((tab) => {
          const isActive = activeTab === tab;

          return (
            <Button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`
                relative h-full text-sm font-medium transition-colors bg-transparent hover:bg-transparent
                ${isActive
                  ? "text-orange-700"
                  : "text-[#404040] hover:text-[#171717]"
                }
              `}
            >
              {tab}

              {tab === "Headers" && (
                <span className="ml-1 text-xs text-[#A3A3A3]">
                  ({headersCount})
                </span>
              )}

              {tab === "Tests" && (
                <span className="ml-1 text-xs text-[#A3A3A3]">(0)</span>
              )}

              {isActive && (
                <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-orange-500" />
              )}
            </Button>
          );
        })}
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-5 dashboard-scrollbar">
        {activeTab === "Params" && <ParamsPanel />}

        {activeTab === "Authorization" && <AuthorizationPanel />}

        {activeTab === "Headers" && (
          <HeadersPanel
            headers={payload.headers}
            onHeadersChange={(headers) =>
              onPayloadChange((prev) => ({
                ...prev,
                headers,
              }))
            }
          />
        )}

        {activeTab === "Body" && (
          <BodyPanel
            bodyType={payload.bodyType}
            rawBodyLanguage={payload.rawBodyLanguage}
            rawBody={payload.rawBody}
            onBodyChange={(nextBody) =>
              onPayloadChange((prev) => ({
                ...prev,
                ...nextBody,
              }))
            }
          />
        )}

        {activeTab === "Pre-request Script" && <PreRequestScriptPanel />}

        {activeTab === "Tests" && 
        <TestsPanel
          workspaceId={workspaceId}
          collectionId={collectionId}
          requestId={requestId}
        />}
      </div>
    </div>
  );
}