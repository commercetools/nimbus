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

// The slot keeps Chakra's native (broad) `colorPalette` so the component can
// pass remapped palette tokens (e.g. `ctvioletAlpha`); the public prop below
// narrows the consumer-facing surface.
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
   * Color palette for the dots. Accepts any Nimbus color palette, plus two
   * semantic aliases tuned for overlaying surfaces:
   *
   * - `"primary"` (default) → `ctvioletAlpha`, for light surfaces.
   * - `"white"` → `whiteAlpha`, for dark surfaces.
   *
   * Any other palette (e.g. `"positive"`, `"info"`, `"grass"`) colors the dots
   * with that palette's `11` shade.
   *
   * @default "primary"
   */
  colorPalette?: NimbusColorPalette | "white";
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
