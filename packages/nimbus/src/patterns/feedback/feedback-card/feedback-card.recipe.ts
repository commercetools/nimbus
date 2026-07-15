import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the FeedbackCard pattern.
 *
 * No variants: FeedbackCard is a composition of existing primitives, not a new
 * visual primitive, so the recipe defines no `variant` or `size` axes. Consumers
 * supply the surface treatment (bg, border, borderRadius, padding) via standard
 * Chakra style props forwarded on `FeedbackCard.Root`, and choose the context by
 * setting `colorPalette` on Root.
 *
 * The card expects short feedback copy (a title + optional subtitle), so Root
 * sets `color: "colorPalette.11"`. Because `color` is inherited, all text
 * content reads in the card's palette automatically (green for `positive`, red
 * for `critical`, …) with no per-element color props. The action `Button` is
 * unaffected — it sets its own color from its recipe.
 */
export const feedbackCardRecipe = defineSlotRecipe({
  slots: ["root", "content", "action"],

  className: "nimbus-feedback-card",

  base: {
    // Responsive wrapping row: content sits on the left, action on the right,
    // and the action wraps below the content when they no longer fit.
    root: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "400",
      // Palette-aware text color: inherited by the content copy so the whole
      // card themes as one. Consumers set the hue via `colorPalette` on Root.
      color: "colorPalette.11",
    },
    // Text area: a vertical stack (title + subtitle) that grows to fill the
    // row and may shrink below its content width so the row can wrap cleanly.
    content: {
      display: "flex",
      flexDirection: "column",
      flex: "1 1 auto",
      minWidth: 0,
      gap: "100",
    },
    // Layout slot for the consumer's action button — positioning only.
    action: {
      display: "flex",
      alignItems: "center",
      flexShrink: 0,
    },
  },
});
