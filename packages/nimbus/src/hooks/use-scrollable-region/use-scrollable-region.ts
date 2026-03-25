import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusRing } from "react-aria";
import type {
  ScrollableOverflow,
  UseScrollableRegionOptions,
  UseScrollableRegionResolvedOptions,
  UseScrollableRegionReturn,
} from "./use-scrollable-region.types";

/** Maps the `overflow` prop to CSS properties. */
function getOverflowStyle(overflow: ScrollableOverflow): React.CSSProperties {
  switch (overflow) {
    case "auto":
      return { overflow: "auto" };
    case "scroll":
      return { overflow: "scroll" };
    case "x-auto":
      return { overflowX: "auto", overflowY: "hidden" };
    case "x-scroll":
      return { overflowX: "scroll", overflowY: "hidden" };
    case "y-auto":
      return { overflowX: "hidden", overflowY: "auto" };
    case "y-scroll":
      return { overflowX: "hidden", overflowY: "scroll" };
    case "none":
      return { overflow: "hidden" };
  }
}

/** Returns whether the given overflow mode checks the horizontal axis. */
function checksHorizontal(overflow: ScrollableOverflow): boolean {
  return (
    overflow === "auto" || overflow === "scroll" || overflow.startsWith("x-")
  );
}

/** Returns whether the given overflow mode checks the vertical axis. */
function checksVertical(overflow: ScrollableOverflow): boolean {
  return (
    overflow === "auto" || overflow === "scroll" || overflow.startsWith("y-")
  );
}

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
 * @internal This hook is not part of the public API. Use the
 * `ScrollableRegion` component for consumer-facing usage. The hook is used
 * internally by Nimbus components that need scrollable-region a11y on
 * existing elements (e.g., compound component slots).
 *
 * @param options - Configuration for overflow detection and accessibility.
 * @returns An object with `ref`, `isOverflowing`, and `containerProps` to
 *   spread onto the scrollable element.
 */
export function useScrollableRegion(
  options: UseScrollableRegionOptions | UseScrollableRegionResolvedOptions = {}
): UseScrollableRegionReturn {
  const {
    role = "group",
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    debounceMs = 100,
    scrollable = "auto",
  } = options;

  const [isOverflowing, setIsOverflowing] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { isFocusVisible, focusProps } = useFocusRing();

  const checkOverflow = useCallback(() => {
    const el = elementRef.current;
    if (!el) return;

    const vertical =
      checksVertical(scrollable) && el.scrollHeight > el.clientHeight;
    const horizontal =
      checksHorizontal(scrollable) && el.scrollWidth > el.clientWidth;

    setIsOverflowing(vertical || horizontal);
  }, [scrollable]);

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

  // Dev-mode warning: only for role="region" where a label is required
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      if (role === "region" && !ariaLabel && !ariaLabelledBy) {
        console.warn(
          '[useScrollableRegion] role="region" requires an accessible name. ' +
            "Provide `aria-label` or `aria-labelledby`."
        );
      }
    }
  }, [role, ariaLabel, ariaLabelledBy]);

  // Build containerProps
  const baseStyle: React.CSSProperties = getOverflowStyle(scrollable);

  const containerProps: UseScrollableRegionReturn["containerProps"] = {
    style:
      isOverflowing && isFocusVisible
        ? { ...baseStyle, ...FOCUS_RING_STYLES }
        : baseStyle,
    ...(isOverflowing ? focusProps : {}),
    // Role and accessible name are always applied so the landmark
    // doesn't appear/disappear as content resizes. Only tabIndex
    // toggles based on overflow state.
    role,
  };

  if (ariaLabel) containerProps["aria-label"] = ariaLabel;
  if (ariaLabelledBy) containerProps["aria-labelledby"] = ariaLabelledBy;

  if (isOverflowing) {
    containerProps.tabIndex = 0;
  }

  return { ref, isOverflowing, containerProps };
}
