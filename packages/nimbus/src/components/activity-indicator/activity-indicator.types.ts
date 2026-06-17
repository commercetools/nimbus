import type {
  HTMLChakraProps,
  RecipeProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";

// ============================================================
// RECIPE PROPS
// ============================================================

type ActivityIndicatorRecipeProps = {
  /**
   * Visual size of the indicator.
   *
   * - `"inherit"` (default) makes the dots em-relative so they scale with the
   *   surrounding `font-size` and flow inline with text.
   * - Fixed sizes (`"2xs"`–`"lg"`) reserve a square icon-box footprint so the
   *   indicator can be dropped into input start/end icon slots; the dots
   *   overflow that box horizontally without affecting layout.
   *
   * @default "inherit"
   */
  size?: RecipeProps<"nimbusActivityIndicator">["size"];
} & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type ActivityIndicatorRootSlotProps = Omit<
  HTMLChakraProps<"span", ActivityIndicatorRecipeProps>,
  "as" | "asChild" | "css" | "colorPalette"
> & {
  /**
   * Color palette for the dots.
   *
   * - `"primary"` for light surfaces.
   * - `"white"` for dark surfaces.
   *
   * @default "primary"
   */
  colorPalette?: "primary" | "white";
};

// ============================================================
// HELPER TYPES
// ============================================================

type ActivityIndicatorVariantProps = ActivityIndicatorRootSlotProps & {
  [key: `data-${string}`]: string;
};

// ============================================================
// MAIN PROPS
// ============================================================

export type ActivityIndicatorProps = ActivityIndicatorVariantProps & {
  /**
   * Accessible label.
   *
   * When omitted, the indicator is decorative (`aria-hidden`) — use this when
   * adjacent visible text already conveys the state. When provided, the
   * indicator becomes a polite live region (`role="status"`,
   * `aria-live="polite"`) announcing this label. Passing an empty string opts
   * into the live region using the localized default label.
   */
  "aria-label"?: string;
  /**
   * Ref forwarding to the root element
   */
  ref?: React.Ref<HTMLSpanElement>;
};
