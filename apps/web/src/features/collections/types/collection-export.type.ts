import type {
  ApiRequestListItem,
  ApiRequestResponse,
} from "@/features/requests/types";

export type ExportableRequest = ApiRequestListItem | ApiRequestResponse;

export type ExportableCollection = {
  id: string;
  name: string;
  description: string | null;
  requests?: ExportableRequest[];
  createdAt?: string;
  updatedAt?: string;
};

export type ExportFormat = "json" | "curl" | "openapi";