export type WorkspaceResponse = {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
};

export type WorkspaceHeaderItem = {
  id: string;
  ownerId: string
  name: string;
  short: string;
};