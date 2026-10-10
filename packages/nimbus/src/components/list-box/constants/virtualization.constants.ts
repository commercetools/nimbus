import { themeTokens } from "@commercetools/nimbus-tokens";

/**
 * Pixel value of a design token such as `"22px"`.
 */
const px = (value: string) => parseFloat(value);

const spacing = (key: keyof typeof themeTokens.spacing) =>
  px(themeTokens.spacing[key].value);

const lineHeight = (key: "sm" | "md") =>
  px(themeTokens.textStyle[key].value.lineHeight);

/**
 * Height of the multi-select checkbox indicator, which is taller than one line
 * of text: `max(1lh, {sizes.600})` in `list-box.recipe.ts`.
 */
const indicatorHeight = px(themeTokens.size["600"].value);

/**
 * Estimated heights in pixels for a virtualized ListBox, derived from the
 * same tokens as `list-box.recipe.ts`. They are estimates: React Aria measures
 * every rendered row, so taller rows (wrapping labels, descriptions, user text
 * spacing) are positioned correctly. When an estimate matches the real height,
 * the scrollbar does not shift while rows are measured.
 *
 * A story asserts that each estimate matches the rendered height within 1px,
 * so a recipe change that alters a height fails CI.
 */
export const LIST_BOX_VIRTUALIZER_HEIGHTS = {
  /**
   * Single-line row: block padding (`py`) + line height, per `size`.
   * The multiple variant uses the checkbox indicator height instead of the
   * line height, because the indicator is taller.
   */
  row: {
    sm: {
      single: spacing("100") * 2 + lineHeight("sm"),
      multiple:
        spacing("100") * 2 + Math.max(lineHeight("sm"), indicatorHeight),
    },
    md: {
      single: spacing("200") * 2 + lineHeight("md"),
      multiple:
        spacing("200") * 2 + Math.max(lineHeight("md"), indicatorHeight),
    },
  },
  /**
   * Section header: padding `200` on both sides + line height `350` + bottom
   * border `solid-25`. The same for every `size`.
   */
  heading:
    spacing("200") * 2 +
    px(themeTokens.lineHeight["350"].value) +
    px(themeTokens.borderWidth["25"].value),
  /**
   * Loader row: padding `200` on both sides + the `xs` loading spinner
   * (`sizes.500`).
   */
  loader: spacing("200") * 2 + px(themeTokens.size["500"].value),
} as const;

/**
 * Space between rows, matching the root `gap` in `list-box.recipe.ts`.
 */
export const LIST_BOX_VIRTUALIZER_GAP = "100";

/**
 * Space around the rows per container `variant`, matching the root padding in
 * `list-box.recipe.ts`. In virtualized mode the recipe's CSS padding is set to
 * 0 and the layout applies this padding instead.
 */
export const LIST_BOX_VIRTUALIZER_PADDING = {
  card: "200",
  plain: 0,
} as const;
