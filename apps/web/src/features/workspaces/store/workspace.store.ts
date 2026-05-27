import { create } from "zustand";

type WorkspaceState = {
  currentWorkspaceId: string | null;
  setCurrentWorkspaceId: (workspaceId: string) => void;
  clearCurrentWorkspaceId: () => void;
};

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  currentWorkspaceId: null,

  setCurrentWorkspaceId: (workspaceId) => {
    set({ currentWorkspaceId: workspaceId });
  },

  clearCurrentWorkspaceId: () => {
    set({ currentWorkspaceId: null });
  },
}));