import { z } from "zod";
import { COLLECTION_COLORS } from "@/constants/collection";

export const createCollectionSchema = z.object({
  name: z.string().min(1, "Collection name is required."),
  description: z.string().optional(),
  color: z.enum(COLLECTION_COLORS),
});

export type CreateCollectionFormValues = z.infer<
  typeof createCollectionSchema
>;