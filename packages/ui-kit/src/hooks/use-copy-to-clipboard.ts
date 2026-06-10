import { useCallback, useRef, useState } from "react";

type UseCopyToClipboardReturn = {
  copied: boolean;
  copy: (text: string) => Promise<boolean>;
  reset: () => void;
};

export function useCopyToClipboard(
  timeout = 1500,
): UseCopyToClipboardReturn {
  const [copied, setCopied] = useState(false);

  const timeoutRef = useRef<number | null>(null);

  const reset = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setCopied(false);
  }, []);

  const copy = useCallback(
    async (text: string) => {
      if (!text) {
        setCopied(false);
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);

        setCopied(true);

        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = window.setTimeout(() => {
          setCopied(false);
          timeoutRef.current = null;
        }, timeout);

        return true;
      } catch {
        setCopied(false);
        return false;
      }
    },
    [timeout],
  );

  return {
    copied,
    copy,
    reset,
  };
}