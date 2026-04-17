import type { UseScrollAreaReturn } from "@chakra-ui/react/scroll-area";
import type {
  HTMLChakraProps,
  SlotRecipeProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";
import type { OmitInternalProps } from "@/type-utils/omit-props";

// ============================================================
// RECIPE PROPS
// ============================================================

/**
 * Recipe props for the ScrollArea component.
 * Inferred from the slot recipe to enable responsive values.
 */
type ScrollAreaRecipeProps = {
  /**
   * Scrollbar visibility variant.
   * - `hover`: scrollbar appears on hover or during active scrolling (default)
   * - `always`: scrollbar is permanently visible
   * @default "hover"
   */
  variant?: SlotRecipeProps<"scrollArea">["variant"];
  /**
   * Scrollbar thickness.
   * @default "sm"
   */
  size?: SlotRecipeProps<"scrollArea">["size"];
} & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

type ScrollAreaRootSlotProps = HTMLChakraProps<"div", ScrollAreaRecipeProps>;

// ============================================================
// MAIN PROPS
// ============================================================

/** Props for the `ScrollArea` component. */
export type ScrollAreaProps = OmitInternalProps<ScrollAreaRootSlotProps> & {
  /** Content to render inside the scrollable area. */
  children: React.ReactNode;
  /**
   * The HTML element type to render the root as.
   */
  // NOTE: Deliberately re-added after `OmitInternalProps` strips it.
  // Unlike React Aria wrappers, ScrollArea composes Chakra compound
  // parts directly, so polymorphic rendering via `as` genuinely works.
  as?: React.ElementType;
  /** A ref to the root scroll area element. */
  ref?: React.Ref<HTMLDivElement>;
  /** A ref to the scrollable viewport element inside the scroll area. */
  viewportRef?: React.Ref<HTMLDivElement>;
  /**
   * Which scrollbar axes to render.
   *
   * When set to `"vertical"` or `"horizontal"`, the opposite axis is actively
   * suppressed: Zag's inline `min-width: fit-content` (or `min-height`) is
   * overridden on the content slot and the viewport clips the other axis.
   * This prevents silent overflow with no visible scrollbar indicator.
   * @default "both"
   */
  orientation?: "vertical" | "horizontal" | "both";
  /**
   * An externally created scroll area machine (from `useScrollArea`).
   * When provided, the component uses `RootProvider` instead of `Root`,
   * allowing external access to scroll state and programmatic control.
   */
  value?: UseScrollAreaReturn;
  /**
   * Scrollbar visibility variant.
   * - `hover`: scrollbar appears on hover or during active scrolling (default)
   * - `always`: scrollbar is permanently visible
   * @default "hover"
   */
  variant?: ScrollAreaRecipeProps["variant"];
  /**
   * Scrollbar thickness.
   * @default "sm"
   */
  size?: ScrollAreaRecipeProps["size"];
  /**
   * Custom element IDs for ScrollArea's internal parts.
   * Use when you need DOM access via `getElementById` (e.g.,
   * `ids={{ viewport: 'my-viewport' }}`).
   */
  ids?: Partial<{
    root: string;
    viewport: string;
    content: string;
    scrollbar: string;
    thumb: string;
  }>;
};

/**
 * Custom element IDs for ScrollArea's internal parts.
 * Pass to the `ids` prop to set known IDs for DOM access.
 */
export type ScrollAreaElementIds = Partial<{
  root: string;
  viewport: string;
  content: string;
  scrollbar: string;
  thumb: string;
}>;
