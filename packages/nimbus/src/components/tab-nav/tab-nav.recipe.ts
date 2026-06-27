import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the TabNav component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 *
 * Renders navigation semantics (`<nav>` + `<a>`) with visual styling that
 * matches the Tabs `line` variant.
 *
 * ⚠️  VISUAL TWIN — KEEP IN SYNC WITH `tabs.recipe.ts`
 * TabNav and Tabs are intentionally separate components with separate recipes
 * (different semantics: navigation links vs. content-panel widget). They do NOT
 * share a recipe. However, they expose the SAME three variants — `line`,
 * `rounded`, and `pill` — which are designed to look identical between the two.
 * If you change colors, spacing, typography, transitions, or focus styles for
 * any of these variants in one, apply the equivalent change to the other.
 * (Tabs additionally layers `orientation`/`placement` onto `line`.)
 */

/**
 * Shared item styles for the `rounded` and `pill` variants.
 *
 * Both reproduce the "soft highlight on the active item" look (vs. the
 * `line` bar): a neutral resting state, a subtle hover wash, and a
 * themeable highlight on the active item driven by `colorPalette` (defaulting
 * to `primary` via the root slot). Padding and font-size are inherited from the
 * shared `--tab-nav-*` size CSS vars so all three sizes keep working.
 *
 * `position: relative` + `zIndex` keep the item's label painted ABOVE the
 * absolutely-positioned sliding indicator (see `tab-nav.root.tsx`). Once the
 * indicator is active (`[data-animated="true"]`, set by the hook on mount), it
 * owns the highlight, so the static per-item background is suppressed to avoid a
 * double highlight.
 */
const highlightItemBase = {
  color: "neutral.11",
  cursor: "pointer",
  fontWeight: "500",
  textDecoration: "none",
  borderRadius: "200",
  position: "relative",
  zIndex: 1,
  transition: "color 150ms ease, background 150ms ease",
  focusVisibleRing: "outside",
  // No hover background — just shift the text to the (themed) active palette so
  // hover never paints over the active item's highlight or the sliding indicator.
  _hover: {
    color: "colorPalette.11",
  },
  '&[aria-current="page"]': {
    color: "colorPalette.11",
    background: "colorPalette.3",
  },
  '[data-animated="true"] &[aria-current="page"]': {
    background: "transparent",
  },
  _disabled: {
    layerStyle: "disabled",
  },
} as const;

export const tabNavSlotRecipe = defineSlotRecipe({
  slots: ["root", "item"],

  className: "nimbus-tab-nav",

  base: {
    root: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      // Anchors the absolutely-positioned sliding indicator (all variants).
      position: "relative",
    },
    item: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "200",
      fontSize: "var(--tab-nav-font-size)",
      paddingTop: "var(--tab-nav-padding-top)",
      paddingRight: "var(--tab-nav-padding-right)",
      paddingBottom: "var(--tab-nav-padding-bottom)",
      paddingLeft: "var(--tab-nav-padding-left)",
    },
  },

  variants: {
    variant: {
      line: {
        root: {
          boxShadow: "0 1px 0 0 {colors.neutral.6}",
        },
        item: {
          color: "neutral.12",
          cursor: "pointer",
          fontWeight: "500",
          textDecoration: "none",
          transition: "all 150ms ease",
          boxShadow: "0 2px 0 0 transparent",
          focusVisibleRing: "outside",
          _hover: {
            color: "primary.11",
          },
          '&[aria-current="page"]': {
            color: "primary.11",
            boxShadow: "0 2px 0 0 {colors.primary.9}",
          },
          // When the animated indicator is active, the sliding bar owns the
          // highlight, so suppress the static bar.
          '[data-animated="true"] &[aria-current="page"]': {
            boxShadow: "0 2px 0 0 transparent",
          },
          _disabled: {
            layerStyle: "disabled",
          },
        },
      },
      // Soft rounded-rect highlight on the active item. No baseline; small gap
      // between items.
      rounded: {
        root: {
          colorPalette: "primary",
          gap: "100",
        },
        item: highlightItemBase,
      },
      // Same idea as `rounded`, but a fully-rounded capsule highlight and a touch
      // more horizontal padding so it reads as a pill.
      pill: {
        root: {
          colorPalette: "primary",
          gap: "100",
        },
        item: {
          ...highlightItemBase,
          borderRadius: "full",
          paddingLeft: "calc(var(--tab-nav-padding-left) + {spacing.100})",
          paddingRight: "calc(var(--tab-nav-padding-right) + {spacing.100})",
        },
      },
    },
    size: {
      sm: {
        item: {
          "--tab-nav-font-size": "fontSizes.300",
          "--tab-nav-padding-top": "spacing.100",
          "--tab-nav-padding-right": "spacing.300",
          "--tab-nav-padding-bottom": "spacing.100",
          "--tab-nav-padding-left": "spacing.300",
        },
      },
      md: {
        item: {
          "--tab-nav-font-size": "fontSizes.350",
          "--tab-nav-padding-top": "spacing.200",
          "--tab-nav-padding-right": "spacing.400",
          "--tab-nav-padding-bottom": "spacing.200",
          "--tab-nav-padding-left": "spacing.400",
        },
      },
      lg: {
        item: {
          "--tab-nav-font-size": "fontSizes.400",
          "--tab-nav-padding-top": "spacing.300",
          "--tab-nav-padding-right": "spacing.600",
          "--tab-nav-padding-bottom": "spacing.300",
          "--tab-nav-padding-left": "spacing.600",
        },
      },
    },
  },

  defaultVariants: {
    variant: "line",
    size: "md",
  },
});
