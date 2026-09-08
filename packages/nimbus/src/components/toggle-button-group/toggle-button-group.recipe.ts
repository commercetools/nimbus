import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the ToggleButtonGroup component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */

export const buttonGroupRecipe = defineSlotRecipe({
  slots: ["root", "button"],
  // Unique class name prefix for the component
  className: "nimbus-toggle-button-group",

  // Base styles applied to all instances of the component
  base: {
    root: {
      display: "inline-flex",
      // Child selector, not the `button` slot: out-specifies the toggle button's
      // own recipe, so segmentation wins without `!important`.
      "& > .nimbus-toggle-button-group__button": {
        borderRadius: "0",
        borderRightWidth: "0",
        // Segmented buttons share edges, so suppress the standalone 1px press
        // nudge (from buttonRecipe.base._pressed) — a pressed segment must stay
        // flush with its neighbours instead of dropping out of alignment. The
        // child selector out-specifies the toggle button's own _pressed rule.
        _pressed: {
          transform: "none",
        },
        "&:first-of-type": {
          borderLeftRadius: "200",
        },
        "&:last-of-type": {
          borderRightWidth: "1px",
          borderRightRadius: "200",
        },
      },
    },
  },

  variants: {
    variant: { outline: {}, subtle: {} },
    activeFillStyle: { tint: {}, solid: {} },
    size: { "2xs": {}, xs: {}, sm: {}, md: {}, xl: {} },
    // `colorPalette` is intentionally NOT a recipe variant. As a variant it would
    // be stripped by `splitVariantProps` and only the enumerated values would
    // work; as a plain style prop it sets `--colorPalette` on the root and
    // cascades to the buttons, so consumers can use any registered palette.
  },

  compoundVariants: [
    {
      variant: "outline",
      activeFillStyle: "tint",
      css: {
        button: {
          _selected: {
            // Draw the right-hand seam from the SELECTED segment itself (a 1px
            // box-shadow), not the neighbour's borderLeftColor — so the colour
            // resolves on the selected button and honours any per-button
            // `colorPalette` override regardless of the segment's position.
            // Lift it above the next segment so the shadow covers that segment's
            // border-left; the last segment keeps its own real rounded border.
            //
            // Known limitation (selectionMode="multiple" only): two ADJACENT
            // selected segments both carry zIndex 1, so the later sibling's own
            // border-left paints over the earlier one's seam shadow. Purely
            // cosmetic, and only at the boundary between two selected neighbours;
            // single-select can never reach it.
            "&:not(:last-of-type)": {
              zIndex: "1",
              boxShadow: "1px 0 0 0 {colors.colorPalette.8}",
            },
          },
        },
      },
    },
    {
      variant: "outline",
      activeFillStyle: "solid",
      css: {
        button: {
          _selected: {
            "&:not(:last-of-type)": {
              zIndex: "1",
              boxShadow: "1px 0 0 0 {colors.colorPalette.9}",
            },
          },
        },
      },
    },
  ],

  defaultVariants: {
    size: "md",
    variant: "outline",
    // activeFillStyle intentionally omitted: the root always resolves it from
    // selectionMode (single → solid, multiple → tint), so a recipe default would
    // never apply and would disagree with the standalone ToggleButton (tint).
  },
});
