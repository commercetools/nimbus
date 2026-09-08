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
      focusRing: "outside",
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
      focusRing: "outside",
      cursor: "pointer",
      color: "neutral.12",
      textStyle: "sm",
      borderRadius: "200",
      display: "flex",
      alignItems: "center",
      gap: "200",
      outline: "none",

      "&[data-selected]": {
        bg: "primary.3",
      },
      "&[data-focused]": {
        bg: "primary.2",
      },
      "&[data-focus-visible]": {
        focusRing: "outside",
      },
      "&:hover:not([data-disabled])": {
        bg: "primary.2",
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

      // Multi-select: the checkbox owns the affordance, so drop the row highlight
      '&[data-selection-mode="multiple"]': {
        alignItems: "flex-start",
        "&[data-selected]": {
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

    // Size scale — aligned to Select / ComboBox (sm, md)
    size: {
      sm: {
        item: {
          textStyle: "sm",
          p: "200",
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
          p: "200",
        },
        itemLeading: {
          "& > svg": {
            boxSize: "500",
          },
        },
      },
    },

    // Row density
    density: {
      comfortable: {
        item: {
          py: "200",
        },
      },
      compact: {
        item: {
          py: "100",
        },
      },
    },
  },

  defaultVariants: {
    variant: "card",
    size: "md",
    density: "comfortable",
  },
});
