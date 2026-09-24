import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the Alert component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */

// Emphasis variants set colors and borders only. The box itself — the grid,
// the padding and the corner radius — lives in `base`, so that changing
// emphasis never reflows the alert or shifts the content inside it.

export const alertRecipe = defineSlotRecipe({
  slots: ["root", "title", "description", "icon", "actions", "dismissButton"],
  className: "nimbus-alert",

  // Base styles applied to every alert: the box and the grid.
  base: {
    root: {
      width: "100%",
      // Every alert carries the same border box, transparent where the
      // emphasis variant draws no visible outline. Variants set `borderColor`
      // only, so switching emphasis never moves the content by a border width.
      border: "solid-25",
      borderColor: "transparent",
      px: "300",
      py: "200",
      borderRadius: "200",

      display: "grid",
      gridTemplateColumns: "auto 1fr auto",
      // Horizontal spacing lives on the icon (marginInlineEnd) and dismiss
      // (marginInlineStart) slots rather than a grid columnGap, so that when
      // no icon renders the leading column collapses with no phantom gap in
      // front of the content. A tight row gap keeps the title and description
      // reading as one block (their line-heights already supply visual
      // separation).
      alignItems: "start",
    },
    icon: {
      gridColumn: "1",
      gridRow: "1",
      /**
       * One text line tall. `lh` resolves against this slot's own computed
       * line height, which it inherits from the alert along with the font
       * size, so the box keeps matching the first line of text when either is
       * changed by a consumer or by the theme. Nothing here is pinned to a
       * pixel value.
       *
       * Centring inside that box is what keeps the row honest: as a block box
       * the svg would sit on the text baseline and stretch the line box past
       * its own height, making the row taller than the text it belongs to.
       */
      height: "1lh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginInlineEnd: "200",
      "& svg": {
        /**
         * The glyph is sized off the alert's own text rather than a fixed
         * token: `1.25em` is the same 20px at the default font size, but
         * follows the alert when a consumer or the theme changes it — the
         * same source of truth the `1lh` box above uses. This is the
         * `ActivityIndicator` `size="inherit"` pattern.
         */
        width: "1.25em",
        height: "1.25em",
        color: "colorPalette.11",
      },
    },
    title: {
      gridColumn: "2",
      order: "1",
      color: "colorPalette.11",
    },
    description: {
      gridColumn: "2",
      order: "2",
      color: "colorPalette.11",
    },
    // Lay the action buttons out as a wrapping row with a consistent gap.
    // Without this the slot has no internal spacing and sibling buttons
    // render flush against one another. The extra top margin lifts the row
    // clear of the message block (rowGap 4px + 8px = 12px total).
    actions: {
      gridColumn: "2",
      order: "3",
      marginTop: "200",
      marginBottom: "200",
      display: "flex",
      alignItems: "center",
      gap: "200",
      flexWrap: "wrap",
    },
    dismissButton: {
      gridColumn: "3",
      gridRow: "1",
      // Boxed to the first text line for the same reason as the icon.
      height: "1lh",
      display: "flex",
      alignItems: "center",
      marginInlineStart: "200",
    },
  },

  variants: {
    // Emphasis axis (kept as `variant` for backwards compatibility).
    variant: {
      flat: {},
      /**
       * The tinted card, and the default. It is called `outlined` because
       * that is the name it has always shipped under — the name predates the
       * emphasis axis, and consumers across the org already pass it. Renaming
       * it would buy them nothing and cost them a codemod, so the name stays
       * and there is no alias to deprecate.
       */
      outlined: {
        root: {
          borderColor: "colorPalette.5",
          backgroundColor: "colorPalette.2",
        },
      },
      /**
       * A neutral card with a status-colored bar down the leading edge — the
       * treatment `Toast` uses as its default (see `toast.recipe.ts`). The
       * status color survives in two places only, the bar and the icon, so a
       * page can stack several of these without reading as a color chart.
       *
       * The bar is an inset box-shadow rather than a border, so it paints
       * inside the border box `base` already reserves and switching to this
       * emphasis still moves nothing. `_rtl` mirrors it to the other edge,
       * which is what the `start` in the name promises — `Toast` names its
       * variant the same way but paints the bar physically on the left.
       */
      "accent-start": {
        root: {
          backgroundColor: "neutral.2",
          borderColor: "neutral.5",
          boxShadow: "inset 3px 0 0 0 {colors.colorPalette.9}",
          _rtl: { boxShadow: "inset -3px 0 0 0 {colors.colorPalette.9}" },
        },
        // The surface is neutral, so the text is too. The status color shows
        // in the bar, the icon and the action buttons — not in the reading
        // surface behind them.
        title: { color: "neutral.12" },
        description: { color: "neutral.11" },
        // Actions keep the alert's status palette, so a critical alert gets a
        // red "Undo" and a positive one a green "View". The surface is
        // unsaturated, so a coloured control reads cleanly against it.
        //
        // The dismiss button stays neutral: it is chrome rather than an
        // action, and colouring it would compete with the actions for the
        // one accent the variant is built around.
        dismissButton: { colorPalette: "neutral" },
      },
    },
  },

  defaultVariants: {
    variant: "outlined",
  },
});
