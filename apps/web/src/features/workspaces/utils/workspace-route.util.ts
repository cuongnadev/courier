export function buildWorkspacePath(workspaceId: string, path: string) {
  const normalizedPath = path === "/" ? "" : path;

  return `/workspaces/${workspaceId}${normalizedPath}`;
}