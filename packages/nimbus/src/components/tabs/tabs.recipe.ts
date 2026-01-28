import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

const tabsVariants = {
  variant: {
    line: {},
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
} as const;

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

  variants: tabsVariants,

  // Compound variants for different variant/orientation/placement combinations
  compoundVariants: [
    // ==================== LINE VARIANT ====================
    // Line + Horizontal
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
    // Vertical + End (applies to all variants including pills)
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
          borderRadius: "400",
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

export type TabsVariant = keyof typeof tabsVariants.variant;
export type TabsOrientation = keyof typeof tabsVariants.orientation;
export type TabsPlacement = keyof typeof tabsVariants.placement;
export type TabsSize = keyof typeof tabsVariants.size;
