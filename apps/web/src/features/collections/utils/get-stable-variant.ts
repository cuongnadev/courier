import type { CollectionVariant } from "@/features/collections/types/collection.type";

const variants: CollectionVariant[] = [
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "pink",
];

export function getStableVariant(id: string | number): CollectionVariant {
  const value = String(id);

  let hash = 0;

  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }

  return variants[Math.abs(hash) % variants.length];
}