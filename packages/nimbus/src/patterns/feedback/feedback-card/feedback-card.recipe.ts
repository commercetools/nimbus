import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the FeedbackCard pattern.
 *
 * Layout only: FeedbackCard is a composition of existing primitives, not a new
 * visual primitive, so the recipe defines no `variant` or `size` axes. Consumers
 * supply all visual treatment (bg, border, borderRadius, padding) via standard
 * Chakra style props forwarded on `FeedbackCard.Root`.
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
