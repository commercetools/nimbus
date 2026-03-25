import type { HTMLChakraProps } from "@chakra-ui/react/styled-system";
import type { ScrollableOverflow } from "@/hooks/use-scrollable-region/use-scrollable-region.types";

// ============================================================
// CHAKRA DIV PROPS (without hook-controlled attributes)
// ============================================================

type ChakraDivProps = Omit<
  HTMLChakraProps<"div">,
  | "role"
  | "aria-label"
  | "aria-labelledby"
  | "tabIndex"
  | "as"
  | "asChild"
  | "elementType"
  | "css"
>;

// ============================================================
// SHARED OPTIONS
// ============================================================

type SharedOptions = {
  /** Ref forwarding to the root element. */
  ref?: React.Ref<HTMLElement>;
  /**
   * Debounce interval in milliseconds for overflow evaluation.
   * @default 100
   */
  debounceMs?: number;
  /**
   * Controls which axis is scrollable and how overflow is handled.
   *
   * - `"auto"` — both axes, scrollbars appear when needed (default)
   * - `"scroll"` — both axes, scrollbars always visible
   * - `"x-auto"` / `"x-scroll"` — horizontal only
   * - `"y-auto"` / `"y-scroll"` — vertical only
   * - `"none"` — overflow hidden, no scrolling
   *
   * @default "auto"
   */
  scrollable?: ScrollableOverflow;
};

// ============================================================
// REGION VARIANT (requires accessible name)
// ============================================================

type RegionProps = SharedOptions &
  ChakraDivProps & {
    /**
     * The landmark role for the scrollable container.
     * Use `"region"` for major page sections.
     */
    role: "region";
  } & (
    | {
        /** The accessible name. Required when `role="region"`. */
        "aria-label": string;
        "aria-labelledby"?: string;
      }
    | {
        "aria-label"?: string;
        /** ID of the labeling element. Required when `role="region"` if `aria-label` is not provided. */
        "aria-labelledby": string;
      }
  );

// ============================================================
// GROUP VARIANT (accessible name optional)
// ============================================================

type GroupProps = SharedOptions &
  ChakraDivProps & {
    /**
     * The landmark role for the scrollable container.
     * @default "group"
     */
    role?: "group";
    /** The accessible name for the scrollable container. */
    "aria-label"?: string;
    /** ID of the element that labels this scrollable container. */
    "aria-labelledby"?: string;
  };

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props for the `ScrollableRegion` component.
 *
 * Combines scroll behavior options with all Chakra style props.
 * When `role="region"`, either `aria-label` or `aria-labelledby` is
 * required at the type level to satisfy WCAG landmark naming requirements.
 */
export type ScrollableRegionProps = RegionProps | GroupProps;
