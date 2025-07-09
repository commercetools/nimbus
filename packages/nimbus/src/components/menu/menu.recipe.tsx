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
      display: "inline-block",
      position: "relative",
    },
    trigger: {
      // Minimal styles - the trigger will be provided by the user via asChild
      // Only essential menu-specific states are defined here
      "&[data-loading]": {
        opacity: "0.7",
        cursor: "wait",
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
      p: "200",
      zIndex: "dropdown",
      position: "relative",

      // Focus styles for keyboard navigation
      "&:focus": {
        outline: "none",
      },

      // Enhanced animation support
      "&[data-state=open]": {
        animationName: "slideInAndFade",
        animationDuration: "200ms",
        animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        animationFillMode: "forwards",
      },

      "&[data-state=closed]": {
        animationName: "slideOutAndFade",
        animationDuration: "150ms",
        animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        animationFillMode: "forwards",
      },

      // Loading state for content
      "&[data-loading]": {
        opacity: "0.6",
        pointerEvents: "none",

        "&::after": {
          content: '""',
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "20px",
          height: "20px",
          marginTop: "-10px",
          marginLeft: "-10px",
          border: "2px solid {colors.neutral.6}",
          borderTop: "2px solid {colors.neutral.11}",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        },
      },

      // Reduced motion support
      "@media (prefers-reduced-motion: reduce)": {
        "&[data-state=open], &[data-state=closed]": {
          animationDuration: "0ms",
        },
      },
    },
    item: {
      display: "flex",
      flexDirection: "column",
      alignItems: "start",
      px: "300",
      py: "200",
      borderRadius: "200",
      cursor: "pointer",
      userSelect: "none",
      color: "neutral.12",
      fontSize: "400",
      lineHeight: "500",
      position: "relative",
      transition: "all 150ms ease-out",

      // Hover state
      "&:hover:not([data-disabled])": {
        backgroundColor: "neutral.3",
        color: "neutral.12",
      },

      // Highlighted state (keyboard navigation)
      "&[data-highlighted]": {
        backgroundColor: "neutral.4",
        outline: "none",
        color: "neutral.12",
      },

      // Active/pressed state
      "&:active:not([data-disabled])": {
        backgroundColor: "neutral.5",
        transform: "scale(0.98)",
      },

      // Focus-visible state for keyboard navigation
      "&:focus-visible": {
        outline: "2px solid",
        outlineColor: "colorPalette.7",
        outlineOffset: "2px",
        backgroundColor: "neutral.4",
      },

      // Selected state
      "&[data-selected]": {
        backgroundColor: "colorPalette.3",
        color: "colorPalette.11",

        "&:hover": {
          backgroundColor: "colorPalette.4",
        },
      },

      // Disabled state
      "&[data-disabled]": {
        layerStyle: "disabled",
        pointerEvents: "none",
      },

      // Danger/destructive state
      "&[data-danger]": {
        color: "critical.11",

        "&:hover:not([data-disabled])": {
          backgroundColor: "critical.3",
          color: "critical.12",
        },

        "&[data-highlighted]": {
          backgroundColor: "critical.4",
          color: "critical.12",
        },

        "&:active:not([data-disabled])": {
          backgroundColor: "critical.5",
        },
      },

      // Loading state
      "&[data-loading]": {
        opacity: "0.7",
        cursor: "wait",
        pointerEvents: "none",
      },

      "&:focus": {
        outline: "none",
      },
    },
    itemLabel: {
      display: "block",
      flexGrow: 1,
      fontWeight: "500",
      textStyle: "sm",
      paddingRight: "1200",
    },
    itemDescription: {
      display: "block",
      textStyle: "sm",
      color: "neutral.10",
    },
    itemKeyboard: {
      position: "absolute",
      right: "300",
      top: "200",
      color: "neutral.10",
      fontFamily: "mono",
      marginLeft: "auto",
      textStyle: "sm",
    },
    separator: {
      height: "25",
      flexShrink: 0,
      backgroundColor: "neutral.6",
      my: "200",
      mx: "-200",
    },
    group: {
      display: "flex",
      flexDirection: "column",
    },
    groupLabel: {
      fontSize: "300",
      fontWeight: "600",
      color: "neutral.11",
      px: "300",
      py: "200",
      marginBottom: "100",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    },
  },
});
