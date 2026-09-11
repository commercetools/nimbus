import { defineSlotRecipe } from "@chakra-ui/react/styled-system";
import { checkboxSlotRecipe } from "../checkbox/checkbox.recipe";

/**
 * Recipe configuration for the ListBox component.
 *
 * Defines base styles and variants via Chakra UI's slot-recipe system. The
 * surface (card) styling is modelled on the Select `options` slot, and the
 * multi-select checkbox indicator reuses the Checkbox recipe exactly as
 * ComboBox does.
 *
 * Selection affordance is intentionally NOT a recipe variant: single-select
 * uses a full-row highlight, multi-select renders a leading checkbox. The
 * multi-select styling keys off React Aria's item render-state attribute
 * `[data-selection-mode="multiple"]` on real slots (`item`, `itemIndicator`) —
 * avoiding ComboBox's dead `options`/`listBox` no-op.
 */
export const listBoxSlotRecipe = defineSlotRecipe({
  slots: [
    "root",
    "item",
    "itemIndicator",
    "itemLeading",
    "itemContent",
    "itemTrailing",
    "section",
    "sectionHeader",
    "emptyState",
    "loader",
  ],
  className: "nimbus-list-box",

  base: {
    // RA <ListBox>
    root: {
      "--scrollbar-color": "colors.neutral.8",
      "--scrollbar-bg": "colors.neutral.3",
      colorPalette: "primary",
      display: "flex",
      flexDirection: "column",
      gap: "100",
      color: "neutral.12",
      // Keyboard-only focus ring. React Aria exposes focus via the
      // [data-focus-visible] attribute, which `focusVisibleRing` keys off;
      // plain `focusRing` keys off :focus/[data-focus] and would also paint on
      // pointer focus. Same rationale as slider.recipe.ts.
      focusVisibleRing: "outside",
      scrollbarWidth: "thin",
      scrollbarColor: "var(--scrollbar-color) var(--scrollbar-bg)",
      // Drop target while dragging items in/over the list
      "&[data-drop-target]": {
        outline: "solid-50",
        outlineColor: "primary.9",
        outlineOffset: "-2px",
      },
    },
    // RA <ListBoxItem>
    item: {
      // Keyboard-only focus ring (see root). Pointer affordances are gated on
      // [data-hovered], which React Aria sets only on actionable rows
      // (selectable, or with onAction); so a plain display row stays
      // cursor: default with no hover highlight.
      focusVisibleRing: "outside",
      cursor: "default",
      color: "neutral.12",
      borderRadius: "200",
      display: "flex",
      alignItems: "center",
      gap: "200",
      outline: "none",

      "&[data-selected]": {
        bg: "primary.3",
        // A hovered or keyboard-focused selected row must never read weaker than
        // selected-alone (React Aria moves focus onto the selected row when the
        // list is focused, so this is the common case). Derive the combined
        // state from the *same* selected color, nudged to higher contrast
        // against the page background. The mix is mode-aware because the primary
        // ramp flips direction between themes: in light mode higher steps get
        // darker (bg is white), in dark mode higher steps get lighter (bg is
        // near-black), so we mix toward black in light and toward white in dark.
        // A single black mix would invert in dark mode (it would pull the row
        // toward the background and read as *less* selected). Scoped away from
        // multi-select, where the checkbox owns the affordance and the row
        // highlight is suppressed (see the multi-select block below).
        //
        // NOTE: `color-mix()` sets a browser floor (Chrome 111 / Safari 16.2 /
        // Firefox 113) and fails silently — an unsupported value is dropped and
        // the cascade falls back to the plain hover color. It is the first use
        // in packages/nimbus/src; revisit alongside #1950's `_hover`/`_selected`
        // conditions (a token step would be mode-safe without the floor).
        '&:is([data-hovered], [data-focused]):not([data-selection-mode="multiple"])':
          {
            bg: {
              _light: "color-mix(in oklab, {colors.primary.3} 90%, black 10%)",
              _dark: "color-mix(in oklab, {colors.primary.3} 90%, white 10%)",
            },
          },
      },
      "&[data-focused]": {
        bg: "primary.2",
      },
      "&[data-hovered]": {
        bg: "primary.2",
        cursor: "pointer",
      },
      "&[data-disabled]": {
        layerStyle: "disabled",
      },
      "&[data-dragging]": {
        opacity: "0.6",
      },

      // React Aria Text slots for rich item content
      '& [slot="label"]': {
        display: "block",
      },
      '& [slot="description"]': {
        display: "block",
        color: "neutral.11",
        textStyle: "xs",
      },

      // Multi-select: the checkbox owns the selection affordance, so suppress
      // the row highlight — but only at rest. A selected row that is hovered or
      // focused keeps the ordinary interaction highlight (primary.2), so it
      // reads exactly like its unselected neighbours instead of losing hover
      // feedback entirely.
      '&[data-selection-mode="multiple"]': {
        alignItems: "flex-start",
        "&[data-selected]:not([data-hovered]):not([data-focused])": {
          bg: "unset",
        },
      },
    },
    // Multi-select leading checkbox — reuses the Checkbox recipe like ComboBox
    itemIndicator: {
      // Align the box with the first line of text (lh units)
      height: "max(1lh, {sizes.600})",
      width: "max(1lh, {sizes.600})",
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      // The selector keys on attribute *presence* (`span[data-selected]`), not
      // `[data-selected='true']`: React renders `data-selected={false}` as the
      // string "false", so the attribute is always present and the unselected
      // box keeps its border; the checked fill is keyed on `[data-selected='true']`
      // inside the copied Checkbox rules. The `size.md` pin mirrors ComboBox and
      // is compile-checked against checkbox.recipe. (Shared indicator styles are
      // to be extracted during the Select/ComboBox → ListBox migration.)
      "& span[data-selected]": {
        ...checkboxSlotRecipe.base?.indicator,
        ...checkboxSlotRecipe.variants?.size.md.indicator,
      },
    },
    // Optional leading media (icon / avatar)
    itemLeading: {
      display: "flex",
      alignItems: "center",
      flexShrink: 0,
      color: "neutral.11",
    },
    // Wraps the label (+ optional description) as a single column
    itemContent: {
      display: "flex",
      flexDirection: "column",
      gap: "50",
      flex: "1",
      minWidth: 0,
    },
    // Optional trailing content (meta, badge, action)
    itemTrailing: {
      display: "flex",
      alignItems: "center",
      flexShrink: 0,
      marginInlineStart: "auto",
      color: "neutral.11",
    },
    // RA <ListBoxSection>
    section: {
      display: "flex",
      flexDirection: "column",
      gap: "100",
    },
    // RA <Header> inside a section
    sectionHeader: {
      textStyle: "xs",
      color: "neutral.11",
      fontWeight: "600",
      lineHeight: "350",
      letterSpacing: "25",
      textTransform: "uppercase",
      p: "200",
      borderBottom: "solid-25",
      borderColor: "neutral.3",
      mb: "100",
    },
    // renderEmptyState content
    emptyState: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      color: "neutral.11",
      textStyle: "sm",
      p: "400",
    },
    // ListBoxLoadMoreItem content
    loader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      p: "200",
      color: "neutral.11",
    },
  },

  variants: {
    // Container treatment: standalone card vs bare list for embedding
    variant: {
      card: {
        root: {
          bg: "bg",
          borderRadius: "200",
          boxShadow: "5",
          p: "200",
          maxHeight: "40svh",
          overflowY: "auto",
        },
      },
      plain: {
        root: {
          bg: "transparent",
          p: "0",
        },
      },
    },

    // Size scale — aligned to Select / ComboBox (sm, md). Size owns the row's
    // inline + block padding and text scale, so option height differs by size
    // (per spec). There is no separate `density` axis: the row rhythm is driven
    // by `size` alone.
    size: {
      sm: {
        item: {
          textStyle: "sm",
          px: "200",
          py: "100",
        },
        itemLeading: {
          "& > svg": {
            boxSize: "400",
          },
        },
      },
      md: {
        item: {
          textStyle: "md",
          px: "200",
          py: "200",
        },
        itemLeading: {
          "& > svg": {
            boxSize: "500",
          },
        },
      },
    },
  },

  defaultVariants: {
    variant: "card",
    size: "md",
  },
});
