import type {
  ApiRequestResponse,
} from "@/features/requests/types";


export type ExportableCollection = {
  id: string;
  name: string;
  description: string | null;
  requests?: ApiRequestResponse[];
  createdAt?: string;
  updatedAt?: string;
};

export type OpenApiSchema = {
  type?:
    | "string"
    | "number"
    | "integer"
    | "boolean"
    | "object"
    | "array";

  format?: string;

  enum?: unknown[];

  required?: string[];

  properties?: Record<string, OpenApiSchema>;

  items?: OpenApiSchema;

  additionalProperties?: boolean;
};

export type ExportFormat = "json" | "curl" | "openapi";