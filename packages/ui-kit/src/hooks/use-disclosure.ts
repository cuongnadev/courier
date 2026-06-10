import { useCallback, useState } from "react";

type UseDisclosureReturn = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function useDisclosure(initialValue = false): UseDisclosureReturn {
  const [isOpen, setOpen] = useState(initialValue);

  const open = useCallback(() => {
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setOpen((previousValue) => !previousValue);
  }, []);

  return {
    isOpen,
    open,
    close,
    toggle,
    setOpen,
  };
}