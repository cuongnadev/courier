import type { RecentActivity, RecentActivityResponse } from "@/features/requests/types/request-run.type";

export function mapRecentActivityResponseToRecentActivity(
  run: RecentActivityResponse,
): RecentActivity {
  return {
    id: run.id,
    requestId: run.requestId,
    method: run.method,
    name: run.name,
    uri: run.uri,
    durationMs: run.durationMs,
    timestamp: new Date(run.createdAt).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    statusCode: run.statusCode,
    status: run.status,
    success: run.status === "SUCCESS",
  };
}