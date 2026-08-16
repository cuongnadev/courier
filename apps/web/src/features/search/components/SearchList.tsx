import type { SearchItem as SearchItemType } from "../types";

import { SearchItem } from "./SearchItem";

type SearchListProps = {
  items: SearchItemType[];
  activeIndex?: number;
  onSelect?: (item: SearchItemType) => void;
};

export function SearchList({
  items,
  activeIndex = 0,
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
          {collections.map((item) => {
            const index = items.indexOf(item);

            return (
              <SearchItem
                key={`${item.type}-${item.id}`}
                item={item}
                active={index === activeIndex}
                onSelect={onSelect}
              />
            );
          })}
        </SearchSection>
      )}

      {requests.length > 0 && (
        <SearchSection title="Requests">
          {requests.map((item) => {
            const index = items.indexOf(item);

            return (
              <SearchItem
                key={`${item.type}-${item.id}`}
                item={item}
                active={index === activeIndex}
                onSelect={onSelect}
              />
            );
          })}
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