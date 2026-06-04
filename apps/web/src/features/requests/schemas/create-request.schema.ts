import { z } from "zod";

export const REQUEST_METHODS = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
] as const;

export const createRequestSchema = z.object({
  name: z.string().min(1, "Request name is required."),
  method: z.enum(REQUEST_METHODS),
  uri: z.string().min(1, "Request URL is required."),
  description: z.string().optional(),
  collectionId: z.string().min(1, "Collection is required."),
});

export type CreateRequestFormValues = z.infer<typeof createRequestSchema>;
