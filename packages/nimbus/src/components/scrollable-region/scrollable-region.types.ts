import type { UseScrollableRegionOptions } from "@/hooks/use-scrollable-region/use-scrollable-region.types";
import type { BoxProps } from "@/components/box/box";

// ============================================================
// MAIN PROPS
// ============================================================

export type ScrollableRegionProps = UseScrollableRegionOptions &
  Omit<
    BoxProps,
    | "role"
    | "aria-label"
    | "aria-labelledby"
    | "tabIndex"
    | "asChild"
    | "elementType"
    | "css"
  > & {
    /**
     * The HTML element to render. Defaults to `"section"` when `role="region"`
     * and `"div"` when `role="group"`.
     */
    as?: BoxProps["as"];
  };
