import type { CollectionResponse, CollectionVariant } from "@/features/collections/types/collection.type";

const variants: CollectionVariant[] = [
  'blue',
  'green',
  'orange',
  'purple',
  'red',
  'pink',
];

function getStableVariant(id: string): CollectionVariant {
  let hash = 0;

  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }

  return variants[Math.abs(hash) % variants.length];
}

export function mapCollectionResponseToCollection(
  collection: Omit<CollectionResponse, 'variant'>,
): CollectionResponse {
  return {
    id: collection.id,
    name: collection.name,
    variant: getStableVariant(collection.id),
    requests: collection.requests,
  };
}