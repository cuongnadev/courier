import type { RequestMethod } from "@/types/api";

export type RequestRunStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "CANCELED";

export type RecentActivityResponse = {
  id: string;
  method: RequestMethod;
  name: string;
  uri: string;
  status: RequestRunStatus;
  statusCode: number | null;
  durationMs: number | null;
  createdAt: string;
};

export type RecentActivity = {
  id: string | number;
  method: RequestMethod;
  name: string;
  uri: string;
  durationMs: number | null;
  timestamp: string;
  statusCode: number | null;
  status: RequestRunStatus;
  success: boolean;
};