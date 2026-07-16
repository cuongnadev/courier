import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@courier/ui-kit";

import { SearchInput } from "./SearchInput";

import { useSearchDialog } from "@/features/search/hooks";

export function GlobalSearchDialog() {
  const { open, closeDialog } = useSearchDialog();

  const [query, setQuery] = useState("");

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setQuery("");
          closeDialog();
        }
      }}
    >
      <DialogContent className="max-w-2xl p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Global Search</DialogTitle>
        </DialogHeader>

        <div className="border-b p-4">
          <SearchInput
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search requests, collections, flows..."
          />
        </div>

        <div className="flex h-80 items-center justify-center text-sm text-muted-foreground">
          Start typing to search...
        </div>
      </DialogContent>
    </Dialog>
  );
}