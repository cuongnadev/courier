export const DEFAULT_WORKSPACE_NAME_SUFFIX = 'Workspace';

export function createDefaultWorkspaceName(fullName: string) {
  return `${fullName}'s ${DEFAULT_WORKSPACE_NAME_SUFFIX}`;
}
