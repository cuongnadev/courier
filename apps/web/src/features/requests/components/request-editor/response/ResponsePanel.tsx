import { useMemo, useState } from "react";
import { PanelRightOpen } from "lucide-react";

import type { RequestRunResponse } from "@/features/requests/types/request-run.type";

import { Button } from "@courier/ui-kit";
import { XIcon } from "@/components/common/icons";

import { ResponseBodyPanel } from "./ResponseBodyPanel";
import { ResponseHeadersPanel } from "./ResponseHeadersPanel";
import { ResponseCookiesPanel } from "./ResponseCookiesPanel";
import { ResponseSchemaValidationPanel } from "./ResponseSchemaValidationPanel";
import { ResponseRawPanel } from "./ResponseRawPanel";

const RESPONSE_TABS = [
  { value: "body", label: "Body" },
  { value: "headers", label: "Headers" },
  { value: "cookies", label: "Cookies" },
  { value: "schema-validation", label: "Schema Validation" },
  { value: "raw", label: "Raw" },
] as const;

type ResponseTabValue = (typeof RESPONSE_TABS)[number]["value"];

type HeaderValue = string | string[] | number | boolean | null | undefined;

type HeaderRecord = Record<string, HeaderValue>;

type ResponseHeaderEntry = readonly [string, string];

type ResponsePanelProps = {
  response: RequestRunResponse | null;
  isSending?: boolean;
};

function getStatusLabel(response: RequestRunResponse) {
  if (response.statusCode) {
    return `${response.statusCode}`;
  }

  return response.status;
}

function getResponseBody(response: RequestRunResponse) {
  return response.responseBody ?? response.errorMessage ?? "";
}

function normalizeHeaders(
  headers?: HeaderRecord | null,
): ResponseHeaderEntry[] {
  if (!headers) return [];

  return Object.entries(headers)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      const normalizedValue = Array.isArray(value)
        ? value.join(", ")
        : String(value);

      return [key, normalizedValue] as const;
    });
}

function splitSetCookieHeader(value: string) {
  return value
    .split(/,(?=\s*[^;,=\s]+=[^;,]+)/)
    .map((cookie) => cookie.trim())
    .filter(Boolean);
}

function getCookiesFromHeaders(headers?: HeaderRecord | null) {
  const normalizedHeaders = normalizeHeaders(headers);

  return normalizedHeaders.flatMap(([key, value]) => {
    if (key.toLowerCase() !== "set-cookie") return [];

    return splitSetCookieHeader(value);
  });
}

export function ResponsePanel({ response, isSending }: ResponsePanelProps) {
  const [activeTab, setActiveTab] = useState<ResponseTabValue>("body");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const responseBody = useMemo(() => {
    if (!response) return "";

    return getResponseBody(response);
  }, [response]);

  const responseHeaders = useMemo(() => {
    return normalizeHeaders(response?.responseHeaders);
  }, [response?.responseHeaders]);

  const responseCookies = useMemo(() => {
    return getCookiesFromHeaders(response?.responseHeaders);
  }, [response?.responseHeaders]);

  const isSuccess = response?.status === "SUCCESS";

  return (
    <aside
      className={`
        flex h-full min-h-0 shrink-0 overflow-hidden bg-white
        transition-[width] duration-300 ease-in-out
        ${isCollapsed ? "w-12 flex-col items-center border-l-[1.25px] border-[#E5E5E5] py-3" : "w-[520px] flex-col"}
      `}
    >
      {isCollapsed ? (
        <>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Expand response panel"
            onClick={() => setIsCollapsed(false)}
            className="
            h-8 w-8 rounded-[6px]
            hover:bg-neutral-100
            focus-visible:ring-0
            focus-visible:ring-offset-0
          "
          >
            <PanelRightOpen size={16} className="text-[#525252]" />
          </Button>

          <div className="mt-4 [writing-mode:vertical-rl] rotate-180 text-xs font-semibold text-[#737373] uppercase">
            Response
          </div>
        </>
      ) : (
        <>
          <div className="flex shrink-0 flex-col gap-3 border-b-[1.25px] border-[#E5E5E5] p-4">
            <div className="flex w-full items-center justify-between">
              <h2 className="text-lg font-semibold text-[#171717]">Response</h2>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Collapse response panel"
                onClick={() => setIsCollapsed(true)}
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

            {response ? (
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div>
                  <span className="text-[#737373]">Status:</span>

                  <span
                    className={`
                  ml-[3px] rounded-[4px] px-2 py-1 font-semibold
                  ${
                    isSuccess
                      ? "bg-[#DCFCE7] text-[#008236]"
                      : "bg-[#FEE2E2] text-[#B91C1C]"
                  }
                `}
                  >
                    {getStatusLabel(response)}
                  </span>
                </div>

                <div>
                  <span className="text-[#737373]">Time:</span>

                  <span className="ml-[3px] font-semibold text-[#171717]">
                    {response.durationMs ?? "-"}ms
                  </span>
                </div>

                <div>
                  <span className="text-[#737373]">Size:</span>

                  <span className="ml-[3px] font-semibold text-[#171717]">
                    {response.responseSize ?? 0}B
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#737373]">
                {isSending
                  ? "Sending request..."
                  : "Send a request to see the response."}
              </p>
            )}
          </div>

          {response ? (
            <>
              <div className="flex h-12 shrink-0 items-center overflow-x-auto border-b-[1.25px] border-[#E5E5E5] bg-white dashboard-scrollbar">
                {RESPONSE_TABS.map((tab) => {
                  const isActive = activeTab === tab.value;

                  const count =
                    tab.value === "headers"
                      ? responseHeaders.length
                      : tab.value === "cookies"
                        ? responseCookies.length
                        : undefined;

                  return (
                    <Button
                      key={tab.value}
                      type="button"
                      variant="ghost"
                      onClick={() => setActiveTab(tab.value)}
                      className={`
                    relative h-full shrink-0 rounded-none bg-transparent px-4 py-0
                    text-sm font-medium shadow-none
                    hover:bg-transparent
                    focus-visible:ring-0
                    focus-visible:ring-offset-0

                    ${
                      isActive
                        ? "text-[#E17100] hover:text-[#E17100]"
                        : "text-[#404040] hover:text-[#171717]"
                    }
                  `}
                    >
                      <span className="whitespace-nowrap">
                        {tab.label}

                        {typeof count === "number" && (
                          <span className="ml-1 text-xs text-[#A3A3A3]">
                            ({count})
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

              <div className="min-h-0 flex-1 overflow-auto p-5 dashboard-scrollbar">
                {activeTab === "body" && (
                  <ResponseBodyPanel
                    responseBody={responseBody}
                    responseUrl={response.uri}
                  />
                )}

                {activeTab === "headers" && (
                  <ResponseHeadersPanel headers={responseHeaders} />
                )}

                {activeTab === "cookies" && (
                  <ResponseCookiesPanel cookies={responseCookies} />
                )}

                {activeTab === "schema-validation" && (
                  <ResponseSchemaValidationPanel />
                )}

                {activeTab === "raw" && (
                  <ResponseRawPanel
                    response={response}
                    headers={responseHeaders}
                  />
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
        </>
      )}
    </aside>
  );
}
