import { defineSlotRecipe } from "@chakra-ui/react";

/**
 * Recipe configuration for the Accordion component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const accordionSlotRecipe = defineSlotRecipe({
  slots: ["root", "disclosure", "trigger", "panel", "accordionTitle"],
  // Unique class name prefix for the component
  className: "bleh-ui-accordion",

  base: {
    root: {
      width: "100%",
    },
    disclosure: {
      width: "100%",
    },
    trigger: {
      fontSize: "var(--font-size)",
      focusVisibleRing: "outside",
      bg: "none",
      flexGrow: 1,
      display: "flex",
      alignItems: "center",
      gap: "8px",
      width: "auto",
      "& svg": {
        width: "var(--width)",
        height: "var(--height)",
        rotate: "0deg",
        transition: "rotate 200ms",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "3px",
      },
      '&[aria-expanded="true"] svg': {
        rotate: "90deg",
      },
    },
    panel: {
      marginLeft: "var(--panel-spacing)",
    },
    accordionTitle: {
      fontWeight: "bold",
    },
  },

  variants: {
    size: {
      md: {
        trigger: {
          "--font-size": "fontSizes.500",
          "& svg": {
            "--width": "sizes.500",
            "--height": "sizes.500",
          },
        },
        panel: {
          "--panel-spacing": "spacing.700",
        },
      },
      sm: {
        trigger: {
          "--font-size": "fontSizes.400",
          "& svg": {
            "--width": "sizes.400",
            "--height": "sizes.400",
          },
        },
        panel: {
          "--panel-spacing": "spacing.600",
        },
      },
    },
  },

  defaultVariants: {
    size: "md",
  },
});
