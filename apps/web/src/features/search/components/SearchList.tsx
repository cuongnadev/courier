import type { SearchItem as SearchItemType } from "../types";

import { SearchItem } from "./SearchItem";

type SearchListProps = {
  items: SearchItemType[];
  onSelect?: (item: SearchItemType) => void;
};

export function SearchList({
  items,
  onSelect,
}: SearchListProps) {
  const collections = items.filter(
    (item) => item.type === "collection",
  );

  const requests = items.filter(
    (item) => item.type === "request",
  );

  return (
    <div className="overflow-y-auto py-2">
      {collections.length > 0 && (
        <SearchSection title="Collections">
          {collections.map((item) => (
            <SearchItem
              key={item.id}
              item={item}
              onSelect={onSelect}
            />
          ))}
        </SearchSection>
      )}

      {requests.length > 0 && (
        <SearchSection title="Requests">
          {requests.map((item) => (
            <SearchItem
              key={item.id}
              item={item}
              onSelect={onSelect}
            />
          ))}
        </SearchSection>
      )}
    </div>
  );
}

type SearchSectionProps = {
  title: string;
  children: React.ReactNode;
};

function SearchSection({
  title,
  children,
}: SearchSectionProps) {
  return (
    <section>
      <div
        className="
          sticky top-0 z-10
          border-y border-neutral-200
          bg-neutral-50
          px-5 py-2
          text-xs font-semibold
          uppercase tracking-wide
          text-neutral-500
        "
      >
        {title}
      </div>

      <div className="py-1">
        {children}
      </div>
    </section>
  );
}