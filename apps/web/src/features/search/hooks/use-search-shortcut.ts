import { useEffect } from "react";
import { useSearchDialog } from "./use-search-dialog";

export function useSearchShortcut() {
  const { open, openDialog, closeDialog } = useSearchDialog();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement || null;

      const isTyping = 
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;

      if((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === "k") {
        event.preventDefault();

        if(!isTyping) {
          openDialog();
        }

        return;
      }

      if(event.key === "Escape" && open) {
        closeDialog();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    }
  }, [open, openDialog, closeDialog]);
}