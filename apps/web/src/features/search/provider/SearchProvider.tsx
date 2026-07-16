import {
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { SearchContext } from "./SearchContext";

type SearchProviderProps = {
  children: ReactNode;
};

export function SearchProvider({ children }: SearchProviderProps) {
  const [open, setOpen] = useState(false);

  const openDialog = () => {
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  const toggleDialog = () => {
    setOpen((prev) => !prev);
  };

  const value = useMemo(
    () => ({
      open,
      openDialog,
      closeDialog,
      toggleDialog,
    }),
    [open],
  );

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}