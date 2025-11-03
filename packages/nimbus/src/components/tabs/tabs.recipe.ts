import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the Tabs component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const tabsSlotRecipe = defineSlotRecipe({
  slots: ["root", "list", "tab", "panels", "panel", "trigger"],

  className: "nimbus-tabs",

  base: {
    root: {
      display: "flex",
      width: "100%",
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
      line: {},
      enclosed: {
        tab: {
          borderTopLeftRadius: "200",
          borderTopRightRadius: "200",
        },
      },
      pills: {
        tab: {
          borderRadius: "full",
          _selected: {
            backgroundColor: "primary.3",
          },
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
    // Line + Horizontal
    {
      variant: "line",
      orientation: "horizontal",
      css: {
        list: {
          borderBottom: "solid-25",
          borderBottomColor: "neutral.6",
        },
        tab: {
          borderBottom: "solid-50",
          borderBottomColor: "transparent",
          marginBottom: "-25",
          _selected: {
            borderBottomColor: "primary.9",
          },
        },
      },
    },
    // Line + Vertical + Start (tabs on left, border on left)
    {
      variant: "line",
      orientation: "vertical",
      placement: "start",
      css: {
        list: {
          borderLeft: "solid-25",
          borderLeftColor: "neutral.6",
        },
        tab: {
          borderLeft: "solid-50",
          borderLeftColor: "transparent",
          marginLeft: "-25",
          _selected: {
            borderLeftColor: "primary.9",
          },
        },
      },
    },
    // Line + Vertical + End (tabs on right, border on right)
    {
      variant: "line",
      orientation: "vertical",
      placement: "end",
      css: {
        list: {
          borderRight: "solid-25",
          borderRightColor: "neutral.6",
        },
        tab: {
          borderRight: "solid-50",
          borderRightColor: "transparent",
          marginRight: "-25",
          _selected: {
            borderRightColor: "primary.9",
          },
        },
      },
    },

    // ==================== ENCLOSED VARIANT ====================
    // Enclosed + Horizontal
    {
      variant: "enclosed",
      orientation: "horizontal",
      css: {
        list: {
          borderBottom: "solid-25",
          borderBottomColor: "neutral.6",
        },
        tab: {
          border: "solid-25",
          borderColor: "transparent",
          borderBottom: "none",
          marginBottom: "-25",
          _selected: {
            backgroundColor: "bg",
            borderColor: "neutral.6",
            borderBottomColor: "bg",
          },
        },
      },
    },
    // Enclosed + Vertical + Start (tabs on left)
    {
      variant: "enclosed",
      orientation: "vertical",
      placement: "start",
      css: {
        list: {
          borderRight: "solid-25",
          borderRightColor: "neutral.6",
        },
        tab: {
          border: "solid-25",
          borderColor: "transparent",
          borderRight: "none",
          marginRight: "-25",
          borderTopLeftRadius: "200",
          borderBottomLeftRadius: "200",
          borderTopRightRadius: "0",
          borderBottomRightRadius: "0",
          _selected: {
            backgroundColor: "bg",
            borderColor: "neutral.6",
            borderRightColor: "bg",
          },
        },
      },
    },
    // Enclosed + Vertical + End (tabs on right)
    {
      variant: "enclosed",
      orientation: "vertical",
      placement: "end",
      css: {
        list: {
          borderLeft: "solid-25",
          borderLeftColor: "neutral.6",
        },
        tab: {
          border: "solid-25",
          borderColor: "transparent",
          borderLeft: "none",
          marginLeft: "-25",
          borderTopLeftRadius: "0",
          borderBottomLeftRadius: "0",
          borderTopRightRadius: "200",
          borderBottomRightRadius: "200",
          _selected: {
            backgroundColor: "bg",
            borderColor: "neutral.6",
            borderLeftColor: "bg",
          },
        },
      },
    },

    // ==================== PLACEMENT-ONLY VARIANTS ====================
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

    // ==================== PILLS VARIANT ====================
    // Pills + Horizontal
    {
      variant: "pills",
      orientation: "horizontal",
      css: {
        list: {
          gap: "200",
          boxShadow: "0 0 0 {sizes.25} {colors.neutral.6}",
          borderRadius: "full",
          padding: "100",
        },
      },
    },
    // Pills + Vertical
    {
      variant: "pills",
      orientation: "vertical",
      css: {
        list: {
          gap: "200",
          boxShadow: "0 0 0 {sizes.25} {colors.neutral.6}",
          borderRadius: "full",
          padding: "100",
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
