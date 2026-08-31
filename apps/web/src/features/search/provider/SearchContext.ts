import { createContext } from "react";

export type SearchContextValue = {
  open: boolean;
  openDialog(): void;
  closeDialog(): void;
  toggleDialog(): void;
};

export const SearchContext =
  createContext<SearchContextValue | null>(null);