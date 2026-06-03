import { useEffect, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";

import { RequestEditorTabs } from "@/features/requests/components/request-editor/request-tabs";
import { RequestTabs } from "@/features/requests/components/request-editor";
import { ResponsePanel } from "@/features/requests/components/request-editor/response";
import { RequestTopBar } from "@/features/requests/components/request-editor/RequestTopBar";

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

  const isSaving =
    createRequestMutation.isPending || updateRequestMutation.isPending;

  const isSending =
    runSavedRequestMutation.isPending ||
    createAndRunRequestMutation.isPending ||
    updateRequestMutation.isPending;

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
    };
  };

  const navigateToRequest = (params: {
    workspaceId: string;
    collectionId: string;
    requestId: string;
    replace?: boolean;
  }) => {
    void navigate({
      to: "/workspaces/$workspaceId/collections/$collectionId/requests/$requestId",
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
    if (!activeTab) return;

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
  };

  const handleSend = async () => {
    if (!activeTab) return;

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
  };

  if (!activeTab) {
    return (
      <main className="flex h-full w-full items-center justify-center bg-white text-sm text-[#737373]">
        No request tab opened.
      </main>
    );
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