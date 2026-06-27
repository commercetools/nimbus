import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the Tabs component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 *
 * ⚠️  VISUAL TWIN — KEEP IN SYNC WITH `tab-nav.recipe.ts`
 * Tabs and TabNav are intentionally separate components with separate recipes
 * (different semantics: content-panel widget vs. navigation links). They do NOT
 * share a recipe. However, they expose the SAME three variants — `line`,
 * `rounded`, and `pill` — designed to look identical between the two. If you
 * change colors, spacing, typography, transitions, or focus styles for any of
 * these variants in one, apply the equivalent change to the other. (Tabs
 * additionally layers `orientation`/`placement` onto `line`.)
 */

/**
 * Shared `tab`-slot styles for the `rounded` and `pill` variants — the mirror of
 * `highlightItemBase` in `tab-nav.recipe.ts`. A neutral resting state, a hover
 * color shift, and a themeable active highlight driven by `colorPalette`
 * (defaulting to `primary` via the root slot). `position: relative` + `zIndex`
 * keep the label above the sliding indicator; once the indicator is active
 * (`[data-animated="true"]`, set by the hook on mount) it owns the highlight, so
 * the static selected background is suppressed to avoid a double highlight.
 */
const highlightTabBase = {
  color: "neutral.11",
  borderRadius: "200",
  _hover: {
    color: "colorPalette.11",
  },
  _selected: {
    color: "colorPalette.11",
    background: "colorPalette.3",
  },
  '[data-animated="true"] &': {
    position: "relative",
    zIndex: "1",
  },
  '[data-animated="true"] &[data-selected]': {
    background: "transparent",
  },
} as const;

export const tabsSlotRecipe = defineSlotRecipe({
  slots: ["root", "list", "tab", "panels", "panel", "trigger"],

  className: "nimbus-tabs",

  base: {
    root: {
      display: "flex",
      width: "100%",
      // Anchors the absolutely-positioned sliding indicator (all variants).
      position: "relative",
    },
    list: {
      display: "flex",
      flexShrink: 0,
    },
    tab: {
      appearance: "none",
      background: "transparent",
      border: "none",
      color: "neutral.12",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "200",
      fontWeight: "500",
      padding: "300 400",
      transition: "all 150ms ease",
      paddingTop: "var(--tabs-padding-top)",
      paddingRight: "var(--tabs-padding-right)",
      paddingBottom: "var(--tabs-padding-bottom)",
      paddingLeft: "var(--tabs-padding-left)",
      fontSize: "var(--tabs-font-size)",
      overflowX: "auto",
      _hover: {
        color: "primary.11",
      },
      _selected: {
        color: "primary.9",
        borderColor: "primary.9",
      },
      _disabled: {
        layerStyle: "disabled",
      },
      _focusVisible: {
        layerStyle: "focusRing",
      },
    },
    panels: {
      flex: 1,
      minWidth: 0,
    },
    panel: {
      _focusVisible: {
        layerStyle: "focusRing",
      },
    },
  },

  variants: {
    variant: {
      // A thin bar marking the active tab — an underline when horizontal, an
      // inner side bar when vertical. The per-orientation/placement marker edges
      // live in `compoundVariants` below.
      line: {
        tab: {
          // Animated: keep the label above the indicator, and let the sliding
          // bar own the active marker (suppress the static bar, all
          // orientations).
          '[data-animated="true"] &': {
            position: "relative",
            zIndex: "1",
          },
          '[data-animated="true"] &[data-selected]': {
            boxShadow: "none",
          },
        },
      },
      // Soft rounded-rect highlight behind the active tab. No baseline; small
      // gap between tabs.
      rounded: {
        root: {
          colorPalette: "primary",
        },
        list: {
          gap: "100",
        },
        tab: highlightTabBase,
      },
      // Same idea as `rounded`, but a fully-rounded capsule highlight and a touch
      // more horizontal padding so it reads as a pill.
      pill: {
        root: {
          colorPalette: "primary",
        },
        list: {
          gap: "100",
        },
        tab: {
          ...highlightTabBase,
          borderRadius: "full",
          paddingLeft: "calc(var(--tabs-padding-left) + {spacing.100})",
          paddingRight: "calc(var(--tabs-padding-right) + {spacing.100})",
        },
      },
    },
    orientation: {
      horizontal: {
        root: {
          flexDirection: "column",
        },
      },
      vertical: {
        root: {
          flexDirection: "row",
        },
        list: {
          flexDirection: "column",
        },
        tab: {
          justifyContent: "flex-start",
        },
      },
    },
    placement: {
      start: {},
      end: {},
    },
    size: {
      sm: {
        tab: {
          "--tabs-font-size": "fontSizes.300",
          "--tabs-padding-top": "spacing.100",
          "--tabs-padding-right": "spacing.300",
          "--tabs-padding-bottom": "spacing.100",
          "--tabs-padding-left": "spacing.300",
        },
      },
      md: {
        tab: {
          "--tabs-font-size": "fontSizes.350",
          "--tabs-padding-top": "spacing.200",
          "--tabs-padding-right": "spacing.400",
          "--tabs-padding-bottom": "spacing.200",
          "--tabs-padding-left": "spacing.400",
        },
      },
      lg: {
        tab: {
          "--tabs-font-size": "fontSizes.400",
          "--tabs-padding-top": "spacing.300",
          "--tabs-padding-right": "spacing.600",
          "--tabs-padding-bottom": "spacing.300",
          "--tabs-padding-left": "spacing.600",
        },
      },
    },
  },

  // Compound variants for different variant/orientation/placement combinations
  compoundVariants: [
    // ==================== LINE VARIANT ====================
    // Line + Horizontal (bar on the bottom edge)
    {
      variant: "line",
      orientation: "horizontal",
      css: {
        list: {
          boxShadow: "0 1px 0 0 {colors.neutral.6}",
        },
        tab: {
          boxShadow: "0 2px 0 0 transparent",
          _selected: {
            boxShadow: "0 2px 0 0 {colors.primary.9}",
          },
        },
      },
    },
    // Line + Vertical + Start (tabs on left, border on right between tabs and content)
    {
      variant: "line",
      orientation: "vertical",
      placement: "start",
      css: {
        list: {
          boxShadow: "1px 0 0 0 {colors.neutral.6}",
        },
        tab: {
          boxShadow: "2px 0 0 0 transparent",
          _selected: {
            boxShadow: "2px 0 0 0 {colors.primary.9}",
          },
        },
      },
    },
    // Line + Vertical + End (tabs on right, border on left between tabs and content)
    {
      variant: "line",
      orientation: "vertical",
      placement: "end",
      css: {
        list: {
          boxShadow: "-1px 0 0 0 {colors.neutral.6}",
        },
        tab: {
          boxShadow: "-2px 0 0 0 transparent",
          _selected: {
            boxShadow: "-2px 0 0 0 {colors.primary.9}",
          },
        },
      },
    },

    // ==================== PLACEMENT-ONLY VARIANTS ====================
    // Vertical + End (applies to all variants)
    {
      orientation: "vertical",
      placement: "end",
      css: {
        root: {
          flexDirection: "row-reverse",
        },
      },
    },
    // Horizontal + Start (default)
    {
      orientation: "horizontal",
      placement: "start",
      css: {
        list: {
          justifyContent: "flex-start",
        },
      },
    },
    // Horizontal + End
    {
      orientation: "horizontal",
      placement: "end",
      css: {
        list: {
          justifyContent: "flex-end",
        },
      },
    },
  ],

  defaultVariants: {
    variant: "line",
    orientation: "horizontal",
    placement: "start",
    size: "md",
  },
});
