import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusRing } from "react-aria";
import type {
  UseScrollableRegionOptions,
  UseScrollableRegionResolvedOptions,
  UseScrollableRegionReturn,
} from "./use-scrollable-region.types";

const FOCUS_RING_STYLES: React.CSSProperties = {
  outlineWidth: "var(--focus-ring-width)",
  outlineColor: "var(--focus-ring-color)",
  outlineStyle:
    "var(--focus-ring-style)" as React.CSSProperties["outlineStyle"],
  outlineOffset: "-2px",
};

/**
 * useScrollableRegion
 * ============================================================
 * Makes scrollable containers accessible to keyboard and screen reader users.
 *
 * Detects content overflow via `ResizeObserver`, dynamically manages
 * `tabIndex`, ARIA roles, accessible name, and a keyboard-only focus ring.
 *
 * This hook is part of the public API and intended for direct consumer use,
 * especially when applying scrollable-region a11y to an existing element
 * (e.g., a compound component slot) where the `ScrollableRegion` component
 * wrapper is not appropriate.
 *
 * @param options - Configuration for overflow detection and accessibility.
 * @returns An object with `ref`, `isOverflowing`, and `containerProps` to
 *   spread onto the scrollable element.
 *
 * @example
 * ```tsx
 * const { ref, containerProps } = useScrollableRegion({
 *   "aria-label": "Log output",
 * });
 * return <div ref={ref} {...containerProps}>...</div>;
 * ```
 */
export function useScrollableRegion(
  options: UseScrollableRegionOptions | UseScrollableRegionResolvedOptions = {}
): UseScrollableRegionReturn {
  const {
    role = "group",
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    debounceMs = 100,
    overflow = "auto",
  } = options;

  const [isOverflowing, setIsOverflowing] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { isFocusVisible, focusProps } = useFocusRing();

  const checkOverflow = useCallback(() => {
    const el = elementRef.current;
    if (!el) return;
    setIsOverflowing(
      el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth
    );
  }, []);

  const debouncedCheck = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      checkOverflow();
      timerRef.current = null;
    }, debounceMs);
  }, [checkOverflow, debounceMs]);

  // Cleanup observer and timer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // Ref callback: sets up / tears down the ResizeObserver
  const ref = useCallback(
    (node: HTMLElement | null) => {
      // Disconnect previous observer
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      elementRef.current = node;

      if (node) {
        // Initial check
        checkOverflow();

        // Observe for size changes
        const observer = new ResizeObserver(() => {
          debouncedCheck();
        });
        observer.observe(node);
        observerRef.current = observer;
      }
    },
    [checkOverflow, debouncedCheck]
  );

  // Dev-mode warning: fires when overflow state or label props change
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      if (isOverflowing && !ariaLabel && !ariaLabelledBy) {
        console.warn(
          "[useScrollableRegion] The container is overflowing but has no " +
            "`aria-label` or `aria-labelledby`. Keyboard users will be able " +
            "to focus this element but screen readers cannot identify it."
        );
      }
    }
  }, [isOverflowing, ariaLabel, ariaLabelledBy]);

  // Build containerProps
  const baseStyle: React.CSSProperties = { overflow };

  const containerProps: UseScrollableRegionReturn["containerProps"] = {
    style:
      isOverflowing && isFocusVisible
        ? { ...baseStyle, ...FOCUS_RING_STYLES }
        : baseStyle,
    ...(isOverflowing ? focusProps : {}),
  };

  if (isOverflowing) {
    containerProps.tabIndex = 0;
    containerProps.role = role;
    if (ariaLabel) containerProps["aria-label"] = ariaLabel;
    if (ariaLabelledBy) containerProps["aria-labelledby"] = ariaLabelledBy;
  }

  return { ref, isOverflowing, containerProps };
}
