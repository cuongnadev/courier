import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(1, "Workspace name is required."),
  description: z.string().optional(),
});

export type CreateWorkspaceFormValues = z.infer<typeof createWorkspaceSchema>;
