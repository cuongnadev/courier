export type ShareResourceType =
  | "workspace"
  | "collection"
  | "request"
  | "environment"
  | "folder"
  | "test-suite";

export type SharePermission =
  | "private"
  | "viewer"
  | "editor";

export type ShareRole =
  | "owner"
  | "editor"
  | "viewer";

export type ShareTarget = {
  id: string;
  name: string;
  type: ShareResourceType;
};

export type ShareMember = {
  id: string;
  name: string;
  email?: string | null;
  role: ShareRole;
  avatarUrl?: string;
  removable?: boolean;
};