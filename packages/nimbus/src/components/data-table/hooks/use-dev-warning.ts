import { useEffect, useRef } from "react";

/**
 * Logs `message` with `console.warn` the first time `condition` is true,
 * once per mount. Development only.
 *
 * @param condition - Whether the warning applies in this render
 * @param message - The warning text
 */
export function useDevWarning(condition: boolean, message: string): void {
  const hasWarnedRef = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (!condition || hasWarnedRef.current) return;
    hasWarnedRef.current = true;
    console.warn(message);
  }, [condition, message]);
}
