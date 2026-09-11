import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

export const buttonGroupRecipe = defineSlotRecipe({
  slots: ["root", "button"],
  className: "nimbus-toggle-button-group",

  base: {
    root: {
      display: "inline-flex",
      // Target the button by class (not the `button` slot) so this out-specifies
      // the toggle button's own recipe — segmentation wins without `!important`.
      "& > .nimbus-toggle-button-group__button": {
        borderRadius: "0",
        borderRightWidth: "0",
        // Segments share edges, so suppress the standalone 1px press nudge — a
        // pressed segment must stay flush with its neighbours.
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
    variant: {
      outline: {
        button: {
          _selected: {
            // Seam between a selected segment and the next: a 1px box-shadow (no
            // layout shift), lifted above the neighbour to cover its border-left.
            // The colour is --active-outline-color, set per button below, so a
            // per-button `colorPalette` override tints its own seam.
            "&:not(:last-of-type)": {
              zIndex: "1",
              boxShadow: "1px 0 0 0 var(--active-outline-color)",
            },
          },
        },
      },
      subtle: {},
    },
    // Seam colour, set on each button so `colorPalette` resolves per button
    // (honouring a per-button override): tint uses step 8, solid the heavier 9.
    activeFillStyle: {
      tint: { button: { "--active-outline-color": "{colors.colorPalette.8}" } },
      solid: {
        button: { "--active-outline-color": "{colors.colorPalette.9}" },
      },
    },
    size: { "2xs": {}, xs: {}, sm: {}, md: {}, xl: {} },
    // `colorPalette` is intentionally NOT a recipe variant: as a variant it would
    // be stripped by `splitVariantProps`; as a style prop it sets `--colorPalette`
    // on the root and cascades, so consumers can use any registered palette.
  },

  defaultVariants: {
    size: "md",
    variant: "outline",
    // activeFillStyle omitted on purpose: the root resolves it from selectionMode
    // (single → solid, multiple → tint), so a recipe default would never apply.
  },
});
