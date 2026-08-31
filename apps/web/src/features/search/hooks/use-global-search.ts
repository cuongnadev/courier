import { useMemo } from "react";

import type { SearchItem } from "@/features/search/types";

type UseGlobalSearchProps = {
  query: string;
  items: SearchItem[];
};

export function useGlobalSearch({
  query,
  items,
}: UseGlobalSearchProps) {
  return useMemo(() => {
    const keyword = query.trim().toLowerCase();

    const hasQuery = keyword.length > 0;

    if(!hasQuery) {
      return {
        results: [],
        hasQuery: false,
        isEmpty: false,
      }
    }

    const results = items.filter((item) => {
      return (
        item.title.toLowerCase().includes(keyword) ||
        item.subtitle?.toLowerCase().includes(keyword) ||
        item.collectionName?.toLowerCase().includes(keyword) ||
        item.keywords?.some((value) => value.toLowerCase().includes(keyword))
      );
    })

    return {
      results,
      hasQuery: true,
      isEmpty: results.length === 0,
    };
  }, [query, items]);
}