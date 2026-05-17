export type FlowResponse = {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  status: string;
  sortOrder: number;
};