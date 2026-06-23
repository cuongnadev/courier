import type {
  SharePermission,
  ShareRole,
  ShareResourceType,
} from "@/features/sharing/types";

export const sharePermissionLabels: Record<
  SharePermission,
  string
> = {
  private: "Private",
  viewer: "Anyone with the link can view",
  editor: "Anyone with the link can edit",
};

export const shareRoleLabels: Record<
  ShareRole,
  string
> = {
  owner: "Owner",
  editor: "Editor",
  viewer: "Viewer",
};

export const shareResourceLabels: Record<
  ShareResourceType,
  string
> = {
  workspace: "Workspace",
  collection: "Collection",
  request: "Request",
  environment: "Environment",
  folder: "Folder",
  "test-suite": "Test Suite",
};