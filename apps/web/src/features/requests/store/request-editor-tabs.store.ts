import { create } from "zustand";

import type { ApiRequestDetailResponse } from "@/features/requests/types/request.type";
import type { RequestRunResponse } from "@/features/requests/types/request-run.type";
import type { RunRequestPayload } from "@/features/requests/types/request-run-payload.type";

export type RequestEditorTab = {
  tabId: string;

  workspaceId: string;
  collectionId: string;

  requestId: string | null;

  name: string;
  payload: RunRequestPayload;

  response: RequestRunResponse | null;

  isDirty: boolean;
};

function buildPayloadFromRequest(
  request: ApiRequestDetailResponse,
): RunRequestPayload {
  return {
    method: request.method,
    uri: request.uri,

    bodyType: request.bodyType,
    rawBodyLanguage: request.rawBodyLanguage,
    rawBody: request.rawBody,

    graphqlQuery: request.graphqlQuery,
    graphqlVariables: request.graphqlVariables,

    headers:
      request.headers?.map((header) => ({
        key: header.key,
        value: header.value ?? "",
        enabled: header.enabled,
      })) ?? [],
  };
}

type RequestEditorTabsStore = {
  tabs: RequestEditorTab[];
  activeTabId: string | null;

  openSavedRequest: (params: {
    workspaceId: string;
    collectionId: string;
    request: ApiRequestDetailResponse;
  }) => void;

  openNewRequest: (params: {
    workspaceId: string;
    collectionId: string;
  }) => void;

  setActiveTab: (tabId: string) => void;
  closeTab: (tabId: string) => void;

  updateActivePayload: (
    updater: (payload: RunRequestPayload) => RunRequestPayload,
  ) => void;

  updateActiveName: (name: string) => void;

  setActiveResponse: (response: RequestRunResponse | null) => void;

  markActiveTabClean: () => void;

  markTabAsSaved: (params: {
    oldTabId: string;
    workspaceId: string;
    collectionId: string;
    request: ApiRequestDetailResponse;
    response?: RequestRunResponse | null;
  }) => void;
};

export const useRequestEditorTabsStore = create<RequestEditorTabsStore>(
  (set) => ({
    tabs: [],
    activeTabId: null,

    openSavedRequest: ({ workspaceId, collectionId, request }) => {
      set((state) => {
        const existingTab = state.tabs.find(
          (tab) => tab.requestId === request.id,
        );

        if (existingTab) {
          return {
            activeTabId: existingTab.tabId,
          };
        }

        const nextTab: RequestEditorTab = {
          tabId: request.id,

          workspaceId,
          collectionId,

          requestId: request.id,

          name: request.name,
          payload: buildPayloadFromRequest(request),

          response: null,

          isDirty: false,
        };

        return {
          tabs: [...state.tabs, nextTab],
          activeTabId: nextTab.tabId,
        };
      });
    },

    openNewRequest: ({ workspaceId, collectionId }) => {
      const tabId = `new-${crypto.randomUUID()}`;

      const nextTab: RequestEditorTab = {
        tabId,

        workspaceId,
        collectionId,

        requestId: null,

        name: "Untitled Request",

        payload: {
          method: "GET",
          uri: "",

          bodyType: "NONE",
          rawBodyLanguage: "JSON",
          rawBody: null,

          graphqlQuery: null,
          graphqlVariables: null,

          headers: [],
        },

        response: null,

        isDirty: true,
      };

      set((state) => ({
        tabs: [...state.tabs, nextTab],
        activeTabId: tabId,
      }));
    },

    setActiveTab: (tabId) => {
      set({
        activeTabId: tabId,
      });
    },

    closeTab: (tabId) => {
      set((state) => {
        const nextTabs = state.tabs.filter((tab) => tab.tabId !== tabId);

        if (state.activeTabId !== tabId) {
          return {
            tabs: nextTabs,
          };
        }

        return {
          tabs: nextTabs,
          activeTabId: nextTabs.at(-1)?.tabId ?? null,
        };
      });
    },

    updateActivePayload: (updater) => {
      set((state) => ({
        tabs: state.tabs.map((tab) =>
          tab.tabId === state.activeTabId
            ? {
                ...tab,
                payload: updater(tab.payload),
                isDirty: true,
              }
            : tab,
        ),
      }));
    },

    updateActiveName: (name) => {
      set((state) => ({
        tabs: state.tabs.map((tab) =>
          tab.tabId === state.activeTabId
            ? {
                ...tab,
                name,
                isDirty: true,
              }
            : tab,
        ),
      }));
    },

    setActiveResponse: (response) => {
      set((state) => ({
        tabs: state.tabs.map((tab) =>
          tab.tabId === state.activeTabId
            ? {
                ...tab,
                response,
              }
            : tab,
        ),
      }));
    },

    markActiveTabClean: () => {
      set((state) => ({
        tabs: state.tabs.map((tab) =>
          tab.tabId === state.activeTabId
            ? {
                ...tab,
                isDirty: false,
              }
            : tab,
        ),
      }));
    },

    markTabAsSaved: ({
      oldTabId,
      workspaceId,
      collectionId,
      request,
      response,
    }) => {
      set((state) => {
        const oldTab = state.tabs.find((tab) => tab.tabId === oldTabId);

        const savedTab: RequestEditorTab = {
          tabId: request.id,

          workspaceId,
          collectionId,

          requestId: request.id,

          name: request.name,
          payload: buildPayloadFromRequest(request),

          response: response ?? oldTab?.response ?? null,

          isDirty: false,
        };

        return {
          tabs: state.tabs.map((tab) =>
            tab.tabId === oldTabId ? savedTab : tab,
          ),
          activeTabId: savedTab.tabId,
        };
      });
    },
  }),
);