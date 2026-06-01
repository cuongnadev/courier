import type { RequestMethod } from "@/types/api.type";

export type RequestRunStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "CANCELED";

export type RequestRunResponse = {
  id: string;

  workspaceId: string;
  requestId: string | null;
  userId: string | null;
  environmentId: string | null;

  method: RequestMethod;
  uri: string;

  status: RequestRunStatus;
  statusCode: number | null;
  durationMs: number | null;

  requestBody: string | null;
  responseBody: string | null;
  responseSize: number | null;
  errorMessage: string | null;

  createdAt: string;
};

export type RecentActivityResponse = {
  id: string;

  requestId: string | null;

  method: RequestMethod;
  name: string;
  uri: string;

  status: RequestRunStatus;
  statusCode: number | null;
  durationMs: number | null;

  createdAt: string;
};

export type RecentActivity = {
  id: string;

  requestId: string | null;

  method: RequestMethod;
  name: string;
  uri: string;

  status: RequestRunStatus;
  statusCode: number | null;
  durationMs: number | null;

  timestamp: string;

  success: boolean;
};