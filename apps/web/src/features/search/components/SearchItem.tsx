import { useEffect, useRef } from "react";

import { FolderOpen, Globe } from "lucide-react";

import { Badge, Button } from "@courier/ui-kit";
import { HighlightText } from "@/components/common/text/HighlightText";

import type { SearchItem as SearchItemType } from "../types";

type Props = {
  query?: string;
  item: SearchItemType;
  active?: boolean;
  onSelect?: (item: SearchItemType) => void;
};

const METHOD_VARIANTS = {
  GET: "bg-emerald-50 text-emerald-700 border-emerald-200",
  POST: "bg-blue-50 text-blue-700 border-blue-200",
  PUT: "bg-amber-50 text-amber-700 border-amber-200",
  PATCH: "bg-purple-50 text-purple-700 border-purple-200",
  DELETE: "bg-red-50 text-red-700 border-red-200",
} as const;

export function SearchItem({
  query = "",
  item,
  active = false,
  onSelect,
}: Props) {
  const itemRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (active) {
      itemRef.current?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [active]);

  return (
    <Button
      ref={itemRef}
      type="button"
      variant="ghost"
      onClick={() => onSelect?.(item)}

      className={`
        h-auto w-full justify-between
        rounded-lg px-5 py-3.5
        transition-colors

        ${
          active
            ? "bg-amber-50 hover:bg-amber-50"
            : "hover:bg-neutral-50"
        }
      `}
    >
      <div className="flex min-w-0 items-center gap-4">
        {item.type === "collection" ? (
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100">
            <FolderOpen className="size-5 text-amber-600" />
          </div>
        ) : (
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100">
            <Globe className="size-5 text-neutral-600" />
          </div>
        )}

        <div className="min-w-0 text-left">
          <p className="truncate text-[15px] font-medium text-neutral-900">
            <HighlightText
              text={item.title}
              query={query}
            />
          </p>

          {item.subtitle && (
            <p className="mt-0.5 truncate text-sm text-neutral-500">
              <HighlightText
              text={item.subtitle}
              query={query}
            />
            </p>
          )}
        </div>
      </div>

      {item.method && (
        <Badge
          variant="outline"
          className={METHOD_VARIANTS[item.method]}
        >
          {item.method}
        </Badge>
      )}
    </Button>
  );
}