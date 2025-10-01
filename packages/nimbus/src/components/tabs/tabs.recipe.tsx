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
      paddingTop: "var(--taps-adding-top)",
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
    orientation: {
      horizontal: {
        root: {
          flexDirection: "column",
        },
        list: {
          borderBottom: "{spacing.25} {colors.neutral.6} solid",
        },
        tab: {
          borderBottom: "{spacing.50} solid transparent",
          marginRight: "-25",
          _selected: {
            borderBottomColor: "primary.9",
          },
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

  // Compound variants for different orientation/placement combinations
  compoundVariants: [
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
    // Vertical + Start (tabs on left, border on left)
    {
      orientation: "vertical",
      placement: "start",
      css: {
        root: {
          flexDirection: "row",
        },
        list: {
          borderLeft: "{spacing.25} {colors.neutral.6} solid",
        },
        tab: {
          borderLeft: "{spacing.50} solid transparent",
          marginLeft: "-25",
          _selected: {
            borderLeftColor: "primary.9",
          },
        },
      },
    },
    // Vertical + End (tabs on right, border on right)
    {
      orientation: "vertical",
      placement: "end",
      css: {
        list: {
          borderRight: "{spacing.25} {colors.neutral.6} solid",
        },
        tab: {
          borderRight: "{spacing.50} solid transparent",
          marginRight: "-25",
          _selected: {
            borderRightColor: "primary.9",
          },
        },
      },
    },
  ],

  defaultVariants: {
    orientation: "horizontal",
    placement: "start",
    size: "md",
  },
});
