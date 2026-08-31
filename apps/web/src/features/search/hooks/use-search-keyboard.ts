import type { SearchItem } from "@/features/search/types";
import { useEffect } from "react";

type UserSearchKeyboardProps = {
  enabled: boolean;
  results: SearchItem[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  onSelect: (item: SearchItem) => void;
}

export function useSearchKeyboard({
  enabled,
  results,
  activeIndex,
  onActiveIndexChange,
  onSelect,
}: UserSearchKeyboardProps) {
  useEffect(() => {
    if(!enabled || results.length === 0) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if(event.key === "ArrowDown") {
        event.preventDefault();

        // onActiveIndexChange((activeIndex + 1) % results.length);
        onActiveIndexChange(
          activeIndex >= results.length - 1 
          ? 0 
          : activeIndex + 1,
        );

        return;
      }

      if(event.key === "ArrowUp") {
        event.preventDefault();

        // onActiveIndexChange((activeIndex - 1 + results.length) % results.length);
        onActiveIndexChange(
          activeIndex <= 0
          ? results.length - 1 
          : activeIndex - 1,
        );

        return;
      }

      if(event.key === "Enter") {
        event.preventDefault();

        const activeItem = results[activeIndex];

        if(activeItem) {
          onSelect(activeItem);
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    }
  }, [
    enabled,
    results,
    activeIndex,
    onActiveIndexChange,
    onSelect,
  ]);
}