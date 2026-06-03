import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  BadgeX,
  Bug,
  Check,
  FlaskConical,
  Loader2,
  Play,
  Sparkles,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  deleteRequestTestCaseApi,
  generateTestCasesApi,
  listRequestTestCasesApi,
} from "@/features/requests/api/generate-test-cases.api";
import type { GeneratedTestCase } from "@/features/requests/types/generate-test-cases.type";

type TestsPanelProps = {
  workspaceId: string;
  collectionId: string;
  requestId: string | null;
};

function stringifyBody(body: unknown) {
  if (body === null || body === undefined) {
    return "";
  }

  if (typeof body === "string") {
    return body;
  }

  try {
    return JSON.stringify(body, null, 2);
  } catch {
    return String(body);
  }
}

function parseBody(value: string) {
  if (!value.trim()) return null;

  try {
    return JSON.parse(value) as unknown;
  } catch {
    return value;
  }
}

function withEnabled(testCases: GeneratedTestCase[]) {
  return testCases.map((testCase) => ({
    ...testCase,
    enabled: testCase.enabled ?? true,
  }));
}

export function TestsPanel({
  workspaceId,
  collectionId,
  requestId,
}: TestsPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeletingTestCaseId, setIsDeletingTestCaseId] = useState<
    string | null
  >(null);

  const [testCases, setTestCases] = useState<GeneratedTestCase[]>([]);
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<string | null>(
    null,
  );
  const [bodyValue, setBodyValue] = useState("");

  const selectedTestCase = useMemo(() => {
    return testCases.find((testCase) => testCase.id === selectedTestCaseId);
  }, [selectedTestCaseId, testCases]);

  const enabledTestCases = useMemo(() => {
    return testCases.filter((testCase) => testCase.enabled);
  }, [testCases]);

  const selectFirstTestCase = useCallback(
    (nextTestCases: GeneratedTestCase[]) => {
      const firstTestCase = nextTestCases[0];

      if (!firstTestCase) {
        setSelectedTestCaseId(null);
        setBodyValue("");
        return;
      }

      setSelectedTestCaseId(firstTestCase.id);
      setBodyValue(stringifyBody(firstTestCase.body));
    },
    [],
  );

  const loadTestCases = useCallback(async () => {
    if (!requestId) {
      setTestCases([]);
      setSelectedTestCaseId(null);
      setBodyValue("");
      return;
    }

    try {
      setIsLoading(true);

      const result = await listRequestTestCasesApi({
        workspaceId,
        collectionId,
        requestId,
      });

      const nextTestCases = withEnabled(result.testCases);

      setTestCases(nextTestCases);
      selectFirstTestCase(nextTestCases);
    } catch (error) {
      console.error("[TestsPanel] load test cases failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, [collectionId, requestId, selectFirstTestCase, workspaceId]);

  useEffect(() => {
    void loadTestCases();
  }, [loadTestCases]);

  const handleGenerateTestCases = async () => {
    if (!requestId) {
      console.warn("[TestsPanel] Missing requestId. Save request first.");
      return;
    }

    try {
      setIsGenerating(true);

      const result = await generateTestCasesApi({
        workspaceId,
        collectionId,
        requestId,
        data: {
          prompt: "Generate test cases including missing body fields",
        },
      });

      console.log("[TestsPanel] generate test cases result:", result);
      console.table(result.testCases);

      const nextTestCases = withEnabled(result.testCases);

      setTestCases(nextTestCases);
      selectFirstTestCase(nextTestCases);
    } catch (error) {
      console.error("[TestsPanel] generate test cases failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectTestCase = (testCase: GeneratedTestCase) => {
    setSelectedTestCaseId(testCase.id);
    setBodyValue(stringifyBody(testCase.body));
  };

  const handleToggleTestCase = (testCaseId: string) => {
    setTestCases((currentTestCases) =>
      currentTestCases.map((testCase) =>
        testCase.id === testCaseId
          ? {
            ...testCase,
            enabled: !testCase.enabled,
          }
          : testCase,
      ),
    );
  };

  const handleBodyChange = (value: string) => {
    setBodyValue(value);

    if (!selectedTestCaseId) return;

    setTestCases((currentTestCases) =>
      currentTestCases.map((testCase) =>
        testCase.id === selectedTestCaseId
          ? {
            ...testCase,
            body: parseBody(value),
          }
          : testCase,
      ),
    );
  };

  const handleDeleteTestCase = async (testCaseId: string) => {
    if (!requestId) return;

    try {
      setIsDeletingTestCaseId(testCaseId);

      await deleteRequestTestCaseApi({
        workspaceId,
        collectionId,
        requestId,
        testCaseId,
      });

      setTestCases((currentTestCases) => {
        const nextTestCases = currentTestCases.filter(
          (testCase) => testCase.id !== testCaseId,
        );

        if (selectedTestCaseId === testCaseId) {
          const nextSelectedTestCase = nextTestCases[0];

          setSelectedTestCaseId(nextSelectedTestCase?.id ?? null);
          setBodyValue(
            nextSelectedTestCase
              ? stringifyBody(nextSelectedTestCase.body)
              : "",
          );
        }

        return nextTestCases;
      });
    } catch (error) {
      console.error("[TestsPanel] delete test case failed:", error);
    } finally {
      setIsDeletingTestCaseId(null);
    }
  };

  const handleRunSelected = () => {
    if (!selectedTestCase) {
      console.warn("[TestsPanel] No selected test case.");
      return;
    }

    console.log("[TestsPanel] run selected test case:", selectedTestCase);
  };

  const handleRunAll = () => {
    console.log("[TestsPanel] run all enabled test cases:", enabledTestCases);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-4 flex shrink-0 items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#171717]">Tests</p>
          <p className="mt-1 text-sm text-[#737373]">
            Generate request body test cases and validate expected status.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={!selectedTestCase}
            onClick={handleRunSelected}
            className="
              h-9 rounded-[10px]
              border-[1.25px] border-[#FED7AA]
              bg-[#FFF7ED] px-3
              text-sm font-semibold text-[#C2410C]
              shadow-none
              hover:border-[#FDBA74]
              hover:bg-[#FFEDD5]
              hover:text-[#9A3412]
              focus-visible:ring-2
              focus-visible:ring-[#FED7AA]
              focus-visible:ring-offset-0
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <Play size={15} className="fill-current" />
            Run
          </Button>

          <Button
            type="button"
            variant="outline"
            disabled={enabledTestCases.length === 0}
            onClick={handleRunAll}
            className="
              h-9 rounded-[10px]
              border-[1.25px] border-[#BBF7D0]
              bg-[#F0FDF4] px-3
              text-sm font-semibold text-[#15803D]
              shadow-none
              hover:border-[#86EFAC]
              hover:bg-[#DCFCE7]
              hover:text-[#166534]
              focus-visible:ring-2
              focus-visible:ring-[#BBF7D0]
              focus-visible:ring-offset-0
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <Play size={15} className="fill-current" />
            Run All
          </Button>

          <Button
            type="button"
            disabled={isGenerating || !requestId}
            onClick={() => void handleGenerateTestCases()}
            className="
              h-9 rounded-[10px]
              border-0
              bg-gradient-to-r from-pink-300 via-pink-500 to-fuchsia-600
              px-4
              text-sm font-semibold text-white
              shadow-[0_8px_18px_rgba(236,72,153,0.28)]
              hover:from-pink-400
              hover:via-pink-500
              hover:to-fuchsia-500
              hover:text-white
              focus-visible:ring-2
              focus-visible:ring-pink-200
              focus-visible:ring-offset-0
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {isGenerating ? (
              <Loader2 size={15} className="animate-spin text-white" />
            ) : (
              <Sparkles size={15} className="text-white" />
            )}

            {isGenerating ? "Generating..." : "Generate Test Cases"}
          </Button>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[320px_minmax(0,1fr)] gap-4">
        <div className="flex min-h-0 flex-col overflow-hidden rounded-[12px] border-[1.25px] border-[#E5E5E5] bg-white">
          <div className="border-b-[1.25px] border-[#E5E5E5] bg-[#FAFAFA] px-4 py-3">
            <p className="text-sm font-semibold text-[#171717]">Test Cases</p>
            <p className="mt-1 text-xs text-[#737373]">
              Enable cases and select one to inspect its request body.
            </p>
          </div>

          <div className="min-h-0 flex-1 overflow-auto p-3 dashboard-scrollbar">
            {isLoading ? (
              <div className="flex items-center gap-2 rounded-[12px] border-[1.25px] border-dashed border-[#E5E5E5] bg-[#FAFAFA] p-5 text-sm text-[#737373]">
                <Loader2 size={15} className="animate-spin" />
                Loading test cases...
              </div>
            ) : testCases.length === 0 ? (
              <div className="rounded-[12px] border-[1.25px] border-dashed border-[#E5E5E5] bg-[#FAFAFA] p-5 text-sm text-[#737373]">
                No test cases generated yet.
              </div>
            ) : (
              <div className="space-y-2">
                {testCases.map((testCase) => {
                  const isSelected = selectedTestCaseId === testCase.id;
                  const isDeleting = isDeletingTestCaseId === testCase.id;

                  return (
                    <div
                      key={testCase.id}
                      className={`
                        flex w-full items-start gap-3 rounded-[12px]
                        border-[1.25px] p-3 transition-colors
                        ${isSelected
                          ? "border-pink-200 bg-pink-50"
                          : "border-[#E5E5E5] bg-white hover:bg-[#FAFAFA]"
                        }
                      `}
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={
                          testCase.enabled
                            ? "Disable test case"
                            : "Enable test case"
                        }
                        onClick={() => handleToggleTestCase(testCase.id)}
                        className={`
                          mt-0.5 size-5 shrink-0 rounded-[5px]
                          border p-0 shadow-none
                          hover:bg-transparent
                          focus-visible:ring-2
                          focus-visible:ring-[#FED7AA]
                          focus-visible:ring-offset-0
                          ${testCase.enabled
                            ? "border-[#FE9A00] bg-[#FE9A00] text-white hover:bg-[#FE9A00]"
                            : "border-[#D4D4D4] bg-white text-transparent hover:border-[#FE9A00]"
                          }
                        `}
                      >
                        {testCase.enabled && <Check size={13} />}
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => handleSelectTestCase(testCase)}
                        className="
                          h-auto min-w-0 flex-1 justify-start rounded-none
                          bg-transparent p-0 text-left
                          shadow-none
                          hover:bg-transparent
                          focus-visible:ring-0
                          focus-visible:ring-offset-0
                        "
                      >
                        <span className="min-w-0 flex-1">
                          <span className="flex min-w-0 items-center gap-1.5">
                            {testCase.isPositiveCase ? (
                              <BadgeCheck
                                size={14}
                                className="shrink-0 text-[#15803D]"
                              />
                            ) : (
                              <BadgeX
                                size={14}
                                className="shrink-0 text-[#B91C1C]"
                              />
                            )}

                            <span className="block min-w-0 flex-1 truncate text-sm font-semibold text-[#171717]">
                              {testCase.name}
                            </span>
                          </span>

                          <span className="mt-1 block text-xs leading-5 text-[#737373]">
                            Expected Status:{" "}
                            <span className="font-semibold text-[#171717]">
                              {testCase.expectedStatus}
                            </span>
                          </span>
                        </span>
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={isDeleting}
                        aria-label="Delete test case"
                        onClick={() => void handleDeleteTestCase(testCase.id)}
                        className="
                          size-8 shrink-0 rounded-[8px]
                          text-[#A3A3A3]
                          shadow-none
                          hover:bg-red-50
                          hover:text-[#DC2626]
                          focus-visible:ring-2
                          focus-visible:ring-red-100
                          focus-visible:ring-offset-0
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                      >
                        {isDeleting ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex h-full min-h-[360px] flex-col overflow-hidden rounded-[12px] border-[1.25px] border-[#E5E5E5] bg-white">
          <div className="flex shrink-0 items-center justify-between border-b-[1.25px] border-[#E5E5E5] bg-[#FAFAFA] px-4 py-2.5">
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-[8px] bg-pink-50 text-pink-600">
                <FlaskConical size={15} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#171717]">
                  Request Body Preview
                </p>
                <p className="truncate text-xs text-[#737373]">
                  {selectedTestCase
                    ? `${selectedTestCase.name} · Expected ${selectedTestCase.expectedStatus
                    } · ${selectedTestCase.isPositiveCase
                      ? "Positive case"
                      : "Negative case"
                    }`
                    : "Select a generated test case to inspect its request body."}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#E5E5E5] bg-white px-2.5 py-1 text-xs font-medium text-[#737373]">
              <Bug size={13} />
              JSON Body
            </div>
          </div>

          <Textarea
            spellCheck={false}
            value={bodyValue}
            onChange={(event) => handleBodyChange(event.target.value)}
            placeholder={`{
  "username": "David",
  "password": "123"
}`}
            className="
              h-full min-h-0 flex-1 resize-none rounded-none border-0 bg-white p-4
              font-mono text-sm leading-6 text-[#171717]
              shadow-none outline-none
              placeholder:text-[#A3A3A3]
              focus-visible:ring-1
              focus-visible:ring-inset
              focus-visible:ring-pink-400
              focus-visible:ring-offset-0
              overflow-auto dashboard-scrollbar
            "
          />
        </div>
      </div>
    </div>
  );
}