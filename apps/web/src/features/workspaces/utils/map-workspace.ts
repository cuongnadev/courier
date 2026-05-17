import type {
  WorkspaceHeaderItem,
  WorkspaceResponse,
} from '@/features/workspaces/types/workspace.type';

function getWorkspaceShort(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('');
}

export function mapWorkspaceHeader(
  workspace: WorkspaceResponse,
): WorkspaceHeaderItem {
  return {
    id: workspace.id,
    ownerId: workspace.ownerId,
    name: workspace.name,
    short: getWorkspaceShort(workspace.name),
  };
}