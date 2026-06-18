import type {
  HTMLChakraProps,
  RecipeProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";
import type { NimbusColorPalette } from "@/type-utils";

// ============================================================
// RECIPE PROPS
// ============================================================

type ActivityIndicatorRecipeProps = {
  /**
   * Visual size of the indicator.
   *
   * - `"inherit"` (default) makes the dots em-relative so they scale with the
   *   surrounding `font-size` and flow inline with text.
   * - Fixed sizes (`"2xs"`–`"lg"`) reserve a square icon-box footprint (the
   *   same scale points as `LoadingSpinner`) so the indicator can be dropped
   *   into input start/end icon slots; the dots are composed inside the square
   *   `viewBox="0 0 24 24"` SVG grid.
   *
   * @default "inherit"
   */
  size?: RecipeProps<"nimbusActivityIndicator">["size"];
} & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

// The slot keeps Chakra's native (broad) `colorPalette`; the public prop below
// narrows the consumer-facing surface to the Nimbus palette set.
export type ActivityIndicatorRootSlotProps = Omit<
  HTMLChakraProps<"span", ActivityIndicatorRecipeProps>,
  "as" | "asChild" | "css"
>;

// ============================================================
// HELPER TYPES
// ============================================================

type ActivityIndicatorVariantProps = ActivityIndicatorRootSlotProps & {
  [key: `data-${string}`]: string;
};

// ============================================================
// MAIN PROPS
// ============================================================

export type ActivityIndicatorProps = Omit<
  ActivityIndicatorVariantProps,
  "colorPalette"
> & {
  /**
   * Color palette for the dots. Accepts any Nimbus color palette (e.g.
   * `"primary"`, `"positive"`, `"info"`, `"ctyellow"`). The dots are filled from
   * the palette's `11` shade by default; pair with `variant="contrast"` to use
   * the palette's `contrast` step when placing the dots on a solid colored
   * surface.
   *
   * @default "primary"
   */
  colorPalette?: NimbusColorPalette;
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
