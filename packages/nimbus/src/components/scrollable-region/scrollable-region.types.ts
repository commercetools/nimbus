import type React from "react";
import type { UseScrollableRegionOptions } from "@/hooks/use-scrollable-region/use-scrollable-region.types";

// ============================================================
// MAIN PROPS
// ============================================================

export type ScrollableRegionProps = UseScrollableRegionOptions & {
  /**
   * Content to render inside the scrollable container.
   */
  children?: React.ReactNode;
  /**
   * Additional CSS class name(s) to apply to the container.
   */
  className?: string;
  /**
   * Inline styles merged with hook-provided styles.
   */
  style?: React.CSSProperties;
  /**
   * Ref forwarding to the root element.
   */
  ref?: React.Ref<HTMLElement>;
  /**
   * Data attributes for testing or custom metadata.
   */
  [key: `data-${string}`]: unknown;
} & Omit<
    React.HTMLAttributes<HTMLElement>,
    | "role"
    | "aria-label"
    | "aria-labelledby"
    | "tabIndex"
    | "children"
    | "className"
    | "style"
  >;
