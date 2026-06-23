export const ROUTE_PATHS = {
  ROOT: "/",

  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
  },

  WORKSPACE: {
    ROOT: "/workspaces/$workspaceId",
    DASHBOARD: "/",
    COLLECTIONS: "/collections",
    COLLECTION_DETAIL: "/collections/$collectionId",
    REQUEST_DETAIL: "/collections/$collectionId/requests/$requestId",
  },
} as const;

export const ROUTE_TO = {
  ROOT: "/",
  LOGIN: "/login",
  REGISTER: "/register",

  WORKSPACE_DASHBOARD: "/workspaces/$workspaceId",
  WORKSPACE_COLLECTIONS: "/workspaces/$workspaceId/collections",
  WORKSPACE_COLLECTION_DETAIL:
    "/workspaces/$workspaceId/collections/$collectionId",
  WORKSPACE_REQUEST_DETAIL:
    "/workspaces/$workspaceId/collections/$collectionId/requests/$requestId",
} as const;