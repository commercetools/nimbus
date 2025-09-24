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
      borderRadius: "md",
      color: "neutral.12",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "medium",
      padding: "300 400",
      transition: "all 150ms ease",
      paddingTop: "var(--padding-top)",
      paddingRight: "var(--padding-right)",
      paddingBottom: "var(--padding-bottom)",
      paddingLeft: "var(--padding-left)",
      fontSize: "var(--font-size)",
      _hover: {
        color: "primary.11",
      },
      _pressed: {
        backgroundColor: "neutral.4",
      },
      _selected: {
        color: "primary.9",
        borderColor: "primary.9",
      },
      _disabled: {
        layerStyle: "disabled",
      },
      _focusVisible: {
        outline: "2px solid",
        outlineColor: "primary.7",
        outlineOffset: "2px",
      },
    },
    panels: {
      flex: 1,
      minWidth: 0,
    },
    panel: {
      _focusVisible: {
        outline: "2px solid",
        outlineColor: "primary.7",
        outlineOffset: "2px",
        borderRadius: "md",
      },
    },
  },

  variants: {
    direction: {
      horizontal: {},
      vertical: {},
    },
    placement: {
      start: {},
      end: {},
    },
    size: {
      sm: {
        tab: {
          "--font-size": "fontSizes.300",
          "--padding-top": "spacing.100",
          "--padding-right": "spacing.300",
          "--padding-bottom": "spacing.100",
          "--padding-left": "spacing.300",
        },
      },
      md: {
        tab: {
          "--font-size": "fontSizes.350",
          "--padding-top": "spacing.200",
          "--padding-right": "spacing.400",
          "--padding-bottom": "spacing.200",
          "--padding-left": "spacing.400",
        },
      },
      lg: {
        tab: {
          "--font-size": "fontSizes.400",
          "--padding-top": "spacing.300",
          "--padding-right": "spacing.600",
          "--padding-bottom": "spacing.300",
          "--padding-left": "spacing.600",
        },
      },
    },
  },

  // Compound variants for different direction/placement combinations
  compoundVariants: [
    // Horizontal + Start (default)
    {
      direction: "horizontal",
      placement: "start",
      css: {
        root: {
          flexDirection: "column",
        },
        list: {
          flexDirection: "row",
          borderBottom: "1px solid",
          borderColor: "neutral.6",
        },
        tab: {
          borderBottom: "2px solid transparent",
          borderRadius: "md md 0 0",
          marginBottom: "-1px",
          _selected: {
            borderBottomColor: "primary.9",
          },
        },
      },
    },
    // // Horizontal + End
    {
      direction: "horizontal",
      placement: "end",
      css: {
        root: {
          flexDirection: "column-reverse",
        },
        list: {
          flexDirection: "row",
          borderTop: "1px solid",
          borderColor: "neutral.6",
        },
        tab: {
          borderTop: "2px solid transparent",
          borderRadius: "0 0 md md",
          marginTop: "-1px",
          _selected: {
            borderTopColor: "primary.9",
          },
        },
      },
    },
    // Vertical + Start
    {
      direction: "vertical",
      placement: "start",
      css: {
        root: {
          flexDirection: "row",
        },
        list: {
          flexDirection: "column",
          borderRight: "1px solid",
          borderColor: "neutral.6",
        },
        tab: {
          borderRight: "2px solid transparent",
          borderRadius: "md 0 0 md",
          marginRight: "-1px",
          justifyContent: "flex-start",
          _selected: {
            borderRightColor: "primary.9",
          },
        },
      },
    },
    // Vertical + End
    {
      direction: "vertical",
      placement: "end",
      css: {
        root: {
          flexDirection: "row-reverse",
        },
        list: {
          flexDirection: "column",
          borderLeft: "1px solid",
          borderColor: "neutral.6",
        },
        tab: {
          borderLeft: "2px solid transparent",
          borderRadius: "0 md md 0",
          marginLeft: "-1px",
          justifyContent: "flex-start",
          _selected: {
            borderLeftColor: "primary.7",
          },
        },
      },
    },
  ],

  defaultVariants: {
    direction: "horizontal",
    placement: "start",
    size: "md",
  },
});
