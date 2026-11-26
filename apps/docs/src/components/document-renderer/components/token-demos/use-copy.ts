import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Copies a text to the clipboard. `copied` holds the last copied text for a
 * moment, so that a button can show that the copy worked.
 */
export const useCopy = (resetAfterMs = 1500) => {
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        return;
      }
      setCopied(text);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(null), resetAfterMs);
    },
    [resetAfterMs]
  );

  return { copied, copy };
};
