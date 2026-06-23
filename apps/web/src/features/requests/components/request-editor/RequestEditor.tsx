import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useLottie } from "lottie-react";

import { RequestEditorTabs } from "@/features/requests/components/request-editor/request-tabs";
import { RequestTabs } from "@/features/requests/components/request-editor";
import { ResponsePanel } from "@/features/requests/components/request-editor/response";
import { RequestTopBar } from "@/features/requests/components/request-editor/RequestTopBar";
import emptyRequestAnimation from "@/assets/techny-bussiness.json";

import type { ApiRequestDetailResponse } from "@/features/requests/types/request.type";
import type {
  CreateRequestPayload,
  UpdateRequestPayload,
} from "@/features/requests/types/request-save-payload.type";

import {
  useCreateAndRunRequest,
  useCreateRequest,
  useRunSavedRequest,
  useUpdateRequest,
} from "@/features/requests/hooks";

import { useRequestEditorTabsStore } from "@/features/requests/store/request-editor-tabs.store";

import { ROUTE_TO } from "@/constants/route-paths";

const EmptyRequestEditorState = () => {
  const { View } = useLottie(
    {
      animationData: emptyRequestAnimation,
      loop: true,
      autoplay: true,
    },
    {
      height: 512,
      width: 512,
    },
  );

  return (
    <main className="flex h-full w-full items-center justify-center bg-white px-6">
      <div className="flex max-w-[512px] flex-col items-center text-center">
        {View}

        <h2 className="mt-4 text-2xl font-semibold text-[#171717]">
          No request tab opened
        </h2>
      </div>
    </main>
  );
}

type RequestEditorProps = {
  workspaceId: string;
  collectionId: string;
  requestId: string;
  request: ApiRequestDetailResponse;
};

export function RequestEditor({
  workspaceId,
  collectionId,
  request,
}: RequestEditorProps) {
  const navigate = useNavigate();

  const [isSavingRequest, setIsSavingRequest] = useState(false);
  const [isSendingRequest, setIsSendingRequest] = useState(false);

  const tabs = useRequestEditorTabsStore((state) => state.tabs);
  const activeTabId = useRequestEditorTabsStore((state) => state.activeTabId);

  const openSavedRequest = useRequestEditorTabsStore(
    (state) => state.openSavedRequest,
  );
  const openNewRequest = useRequestEditorTabsStore(
    (state) => state.openNewRequest,
  );
  const setActiveTab = useRequestEditorTabsStore((state) => state.setActiveTab);
  const closeTab = useRequestEditorTabsStore((state) => state.closeTab);
  const updateActivePayload = useRequestEditorTabsStore(
    (state) => state.updateActivePayload,
  );
  const updateActiveName = useRequestEditorTabsStore(
    (state) => state.updateActiveName,
  );
  const setActiveResponse = useRequestEditorTabsStore(
    (state) => state.setActiveResponse,
  );
  const markActiveTabClean = useRequestEditorTabsStore(
    (state) => state.markActiveTabClean,
  );
  const markTabAsSaved = useRequestEditorTabsStore(
    (state) => state.markTabAsSaved,
  );

  const activeTab = useMemo(
    () => tabs.find((tab) => tab.tabId === activeTabId) ?? null,
    [tabs, activeTabId],
  );

  const createRequestMutation = useCreateRequest();
  const updateRequestMutation = useUpdateRequest();
  const runSavedRequestMutation = useRunSavedRequest();
  const createAndRunRequestMutation = useCreateAndRunRequest();

  const isSaving = isSavingRequest;
  const isSending = isSendingRequest;

  useEffect(() => {
    openSavedRequest({
      workspaceId,
      collectionId,
      request,
    });
  }, [workspaceId, collectionId, request, openSavedRequest]);

  const buildCreatePayload = (): CreateRequestPayload | null => {
    if (!activeTab) return null;

    return {
      name: activeTab.name.trim() || "Untitled Request",

      method: activeTab.payload.method,
      uri: activeTab.payload.uri,

      bodyType: activeTab.payload.bodyType,
      rawBodyLanguage: activeTab.payload.rawBodyLanguage,
      rawBody: activeTab.payload.rawBody,

      graphqlQuery: activeTab.payload.graphqlQuery,
      graphqlVariables: activeTab.payload.graphqlVariables,

      headers: activeTab.payload.headers.map((header) => ({
      key: header.key,
      value: header.value,
      enabled: header.enabled,
    })),
    };
  };

  const buildUpdatePayload = (): UpdateRequestPayload | null => {
    if (!activeTab) return null;

    return {
      name: activeTab.name.trim() || "Untitled Request",

      method: activeTab.payload.method,
      uri: activeTab.payload.uri,

      bodyType: activeTab.payload.bodyType,
      rawBodyLanguage: activeTab.payload.rawBodyLanguage,
      rawBody: activeTab.payload.rawBody,

      graphqlQuery: activeTab.payload.graphqlQuery,
      graphqlVariables: activeTab.payload.graphqlVariables,

      headers: activeTab.payload.headers.map((header) => ({
      key: header.key,
      value: header.value,
      enabled: header.enabled,
    })),
    };
  };

  const navigateToRequest = (params: {
    workspaceId: string;
    collectionId: string;
    requestId: string;
    replace?: boolean;
  }) => {
    void navigate({
      to: ROUTE_TO.WORKSPACE_REQUEST_DETAIL,
      params: {
        workspaceId: params.workspaceId,
        collectionId: params.collectionId,
        requestId: params.requestId,
      },
      replace: params.replace,
    });
  };

  const handleActiveTabChange = (tabId: string) => {
    const nextTab = tabs.find((tab) => tab.tabId === tabId);
    if (!nextTab) return;

    setActiveTab(tabId);

    if (nextTab.requestId) {
      navigateToRequest({
        workspaceId: nextTab.workspaceId,
        collectionId: nextTab.collectionId,
        requestId: nextTab.requestId,
      });
    }
  };

  const handleAddTab = () => {
    openNewRequest({
      workspaceId,
      collectionId,
    });
  };

  const handleSave = async () => {
    if (!activeTab || isSavingRequest || isSendingRequest) return;

    try {
      setIsSavingRequest(true);

      if (activeTab.requestId) {
        const payload = buildUpdatePayload();
        if (!payload) return;

        await updateRequestMutation.mutateAsync({
          workspaceId: activeTab.workspaceId,
          requestId: activeTab.requestId,
          data: payload,
        });

        markActiveTabClean();
        return;
      }

      const payload = buildCreatePayload();
      if (!payload) return;

      const createdRequest = await createRequestMutation.mutateAsync({
        workspaceId: activeTab.workspaceId,
        collectionId: activeTab.collectionId,
        data: payload,
      });

      markTabAsSaved({
        oldTabId: activeTab.tabId,
        workspaceId: activeTab.workspaceId,
        collectionId: activeTab.collectionId,
        request: createdRequest,
        response: null,
      });

      navigateToRequest({
        workspaceId: activeTab.workspaceId,
        collectionId: activeTab.collectionId,
        requestId: createdRequest.id,
        replace: true,
      });
    } finally {
      setIsSavingRequest(false);
    }
  };

  const handleSend = async () => {
    if (!activeTab || isSendingRequest || isSavingRequest) return;

    try {
      setIsSendingRequest(true);

      setActiveResponse(null);

      if (activeTab.requestId) {
        const payload = buildUpdatePayload();

        if (payload) {
          await updateRequestMutation.mutateAsync({
            workspaceId: activeTab.workspaceId,
            requestId: activeTab.requestId,
            data: payload,
          });

          markActiveTabClean();
        }

        const run = await runSavedRequestMutation.mutateAsync({
          workspaceId: activeTab.workspaceId,
          collectionId: activeTab.collectionId,
          requestId: activeTab.requestId,
          data: activeTab.payload,
        });

        setActiveResponse(run);
        return;
      }

      const result = await createAndRunRequestMutation.mutateAsync({
        workspaceId: activeTab.workspaceId,
        collectionId: activeTab.collectionId,
        data: {
          name: activeTab.name.trim() || "Untitled Request",
          ...activeTab.payload,
        },
      });

      markTabAsSaved({
        oldTabId: activeTab.tabId,
        workspaceId: activeTab.workspaceId,
        collectionId: activeTab.collectionId,
        request: result.request,
        response: result.run,
      });

      navigateToRequest({
        workspaceId: activeTab.workspaceId,
        collectionId: activeTab.collectionId,
        requestId: result.request.id,
        replace: true,
      });
    } finally {
      setIsSendingRequest(false);
    }
  };

  if (!activeTab) {
    return <EmptyRequestEditorState />;
  }

  return (
    <main className="flex h-full min-h-0 w-full flex-col overflow-auto bg-white dashboard-scrollbar">
      <RequestTabs
        tabs={tabs}
        activeTabId={activeTabId}
        onActiveTabChange={handleActiveTabChange}
        onCloseTab={closeTab}
        onAddTab={handleAddTab}
        onRenameTab={(tabId, name) => {
          if (tabId === activeTabId) {
            updateActiveName(name);
          }
        }}
      />

      <div className="flex min-h-0 flex-1">
        <section className="flex min-w-0 flex-1 flex-col border-r-[1.25px] border-[#E5E5E5]">
          <RequestTopBar
            method={activeTab.payload.method}
            uri={activeTab.payload.uri}
            isSending={isSending}
            isSaving={isSaving}
            onMethodChange={(method) =>
              updateActivePayload((payload) => ({
                ...payload,
                method,
              }))
            }
            onUriChange={(uri) =>
              updateActivePayload((payload) => ({
                ...payload,
                uri,
              }))
            }
            onSend={handleSend}
            onSave={handleSave}
          />

          <RequestEditorTabs
            workspaceId={activeTab.workspaceId}
            collectionId={activeTab.collectionId}
            requestId={activeTab.requestId}
            payload={activeTab.payload}
            onPayloadChange={(updater) => {
              updateActivePayload((payload) =>
                typeof updater === "function" ? updater(payload) : updater,
              );
            }}
          />
        </section>

        <ResponsePanel response={activeTab.response} isSending={isSending} />
      </div>
    </main>
  );
}
