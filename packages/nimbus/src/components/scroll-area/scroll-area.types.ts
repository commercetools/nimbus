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
   * Visual style of the scrollbar (recipe-facing value).
   * @default "solid"
   */
  variant?: SlotRecipeProps<"scrollArea">["variant"];
  /**
   * Scrollbar thickness.
   * @default "sm"
   */
  size?: SlotRecipeProps<"scrollArea">["size"];
  /**
   * Whether the scrollbar auto-hides or stays visible (recipe-facing value).
   * @default "auto-hide"
   */
  scrollbarVisibility?: SlotRecipeProps<"scrollArea">["scrollbarVisibility"];
} & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

type ScrollAreaRootSlotProps = HTMLChakraProps<"div", ScrollAreaRecipeProps>;

/**
 * Style props that would collide with ScrollArea's internal overflow control.
 * The root has `overflow: hidden` from the recipe, the viewport owns
 * `overflow: auto` / axis clipping, and `orientation` drives the strict
 * clipping — consumers setting these would silently break scroll behavior.
 */
type ConflictingProps = "overflow" | "overflowX" | "overflowY";

// ============================================================
// MAIN PROPS
// ============================================================

/** Props for the `ScrollArea` component. */
export type ScrollAreaProps = Omit<
  OmitInternalProps<ScrollAreaRootSlotProps>,
  ConflictingProps
> & {
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
   * Visual style of the scrollbar.
   * - `solid` (default): grey track, thumb fills its width (the original look).
   * - `inset`: grey track with an inset, floating pill thumb.
   * - `hidden`: no track — only the thumb shows (overlay look).
   * - `glass`: translucent, frosted track that blurs the content behind it.
   *
   * In every visual the bar auto-hides when idle: it appears when the pointer
   * enters the area or when the content scrolls, then hides after a short idle
   * delay; while the pointer stays inside, only scrolling reveals it again.
   *
   * `hover` and `always` are **deprecated** aliases kept for backward
   * compatibility: use `variant="solid"` instead of `hover`, and
   * `scrollbarVisibility="always"` instead of `always`.
   * @default "solid"
   */
  variant?: "solid" | "inset" | "hidden" | "glass" | "hover" | "always";
  /**
   * When the scrollbar is shown.
   * - `auto-hide` (default): the bar appears when the pointer enters the area
   *   or when the content scrolls, then hides after a short idle delay. While
   *   the pointer stays inside, only scrolling reveals it again.
   * - `always`: the bar stays visible, and the viewport reserves a gutter so it
   *   never overlays content.
   *
   * Independent of `variant`, so any visual can be either mode — e.g.
   * `<ScrollArea variant="inset" scrollbarVisibility="always" />`.
   * @default "auto-hide"
   */
  scrollbarVisibility?: "auto-hide" | "always";
  /**
   * Scrollbar thickness.
   * @default "sm"
   */
  size?: ScrollAreaRecipeProps["size"];
  /**
   * Custom element IDs for ScrollArea's internal parts.
   * Use when you need DOM access via `getElementById` (e.g.,
   * `ids={{ viewport: 'my-viewport' }}`).
   *
   * Only `root`, `viewport`, and `content` are honored by the underlying
   * state machine. Scrollbar and thumb elements are located by data
   * attributes and cannot be renamed via ids.
   */
  ids?: Partial<{
    root: string;
    viewport: string;
    content: string;
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
}>;
