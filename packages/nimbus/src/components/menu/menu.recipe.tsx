import { defineSlotRecipe } from "@chakra-ui/react";

/**
 * Recipe configuration for the Menu component.
 * Defines the styling variants and base styles using Chakra UI's slot recipe system.
 */
export const menuSlotRecipe = defineSlotRecipe({
  slots: [
    "root",
    "trigger",
    "content",
    "item",
    "itemLabel",
    "itemDescription",
    "itemKeyboard",
    "separator",
    "group",
    "groupLabel",
  ],
  // Unique class name prefix for the component
  className: "nimbus-menu",

  // Base styles applied to all instances of the component
  base: {
    root: {
      colorPalette: "neutral",
      display: "inline-block",
      position: "relative",
    },
    trigger: {
      cursor: "button",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "200",
      borderRadius: "200",
      color: "neutral.12",
      userSelect: "none",
      focusRing: "outside",

      "&[data-state=open]": {
        backgroundColor: "neutral.3",
      },

      "&[data-disabled]": {
        layerStyle: "disabled",
        pointerEvents: "none",
      },
    },
    content: {
      display: "flex",
      flexDirection: "column",
      backgroundColor: "neutral.1",
      borderRadius: "300",
      border: "solid-25",
      borderColor: "neutral.6",
      boxShadow: "lg",
      minWidth: "200px",
      maxHeight: "400px",
      overflowY: "auto",
      padding: "200",
      zIndex: "dropdown",

      // Focus styles for keyboard navigation
      "&:focus": {
        outline: "none",
      },

      // Animation support
      "&[data-state=open]": {
        animationName: "fadeIn",
        animationDuration: "150ms",
        animationTimingFunction: "ease-out",
      },

      "&[data-state=closed]": {
        animationName: "fadeOut",
        animationDuration: "100ms",
        animationTimingFunction: "ease-in",
      },
    },
    item: {
      display: "flex",
      alignItems: "center",
      gap: "300",
      minHeight: "900",
      padding: "200 300",
      borderRadius: "200",
      cursor: "pointer",
      userSelect: "none",
      color: "neutral.12",
      fontSize: "400",
      lineHeight: "500",

      "&[data-highlighted]": {
        backgroundColor: "neutral.3",
        outline: "none",
      },

      "&[data-disabled]": {
        color: "neutral.8",
        cursor: "not-allowed",
        pointerEvents: "none",
      },

      "&:focus": {
        outline: "none",
      },
    },
    itemLabel: {
      flexGrow: 1,
      fontWeight: "500",
    },
    itemDescription: {
      fontSize: "300",
      color: "neutral.10",
      marginTop: "50",
    },
    itemKeyboard: {
      fontSize: "300",
      color: "neutral.10",
      fontFamily: "mono",
      marginLeft: "auto",
    },
    separator: {
      height: "25",
      backgroundColor: "neutral.6",
      margin: "200 0",
    },
    group: {
      display: "flex",
      flexDirection: "column",
    },
    groupLabel: {
      fontSize: "300",
      fontWeight: "600",
      color: "neutral.11",
      padding: "200 300",
      marginBottom: "100",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    },
  },

  variants: {
    // Size variants
    size: {
      sm: {
        trigger: {
          minHeight: "800",
          padding: "0 300",
          fontSize: "350",
          gap: "100",
        },
        content: {
          padding: "100",
          minWidth: "160px",
        },
        item: {
          minHeight: "700",
          padding: "100 200",
          fontSize: "350",
          gap: "200",
        },
        groupLabel: {
          padding: "100 200",
          fontSize: "250",
        },
      },
      md: {
        trigger: {
          minHeight: "1000",
          padding: "0 400",
          fontSize: "400",
          gap: "200",
        },
        content: {
          padding: "200",
          minWidth: "200px",
        },
        item: {
          minHeight: "900",
          padding: "200 300",
          fontSize: "400",
          gap: "300",
        },
        groupLabel: {
          padding: "200 300",
          fontSize: "300",
        },
      },
      lg: {
        trigger: {
          minHeight: "1200",
          padding: "0 500",
          fontSize: "500",
          gap: "300",
        },
        content: {
          padding: "300",
          minWidth: "240px",
        },
        item: {
          minHeight: "1100",
          padding: "300 400",
          fontSize: "500",
          gap: "400",
        },
        groupLabel: {
          padding: "300 400",
          fontSize: "350",
        },
      },
    },

    // Visual style variants
    variant: {
      solid: {
        trigger: {
          backgroundColor: "neutral.3",
          border: "solid-25",
          borderColor: "neutral.6",

          "&:hover": {
            backgroundColor: "neutral.4",
            borderColor: "neutral.7",
          },
        },
      },
      outline: {
        trigger: {
          backgroundColor: "transparent",
          border: "solid-25",
          borderColor: "neutral.7",

          "&:hover": {
            backgroundColor: "neutral.2",
            borderColor: "neutral.8",
          },
        },
      },
      ghost: {
        trigger: {
          backgroundColor: "transparent",
          border: "none",

          "&:hover": {
            backgroundColor: "neutral.3",
          },
        },
      },
    },
  },

  defaultVariants: {
    size: "md",
    variant: "outline",
  },
});
