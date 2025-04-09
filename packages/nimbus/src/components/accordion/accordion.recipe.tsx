import { defineSlotRecipe } from "@chakra-ui/react";

/**
 * Recipe configuration for the Accordion component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const accordionSlotRecipe = defineSlotRecipe({
  slots: [
    "root",
    "disclosure",
    "trigger",
    "panel",
    "accordionTitle",
    "headerContentRight",
  ],
  // Unique class name prefix for the component
  className: "nimbus-accordion",

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
      minHeight: "1200",
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
      },
      '&[aria-expanded="true"] svg': {
        rotate: "90deg",
      },
      "&[disabled]": {
        layerStyle: "disabled",
      },
    },
    panel: {
      paddingTop: "var(--padding-top)",
      paddingBottom: "var(--padding-bottom)",
      paddingLeft: "var(--padding-left)",
      '&[aria-hidden="true"]': {
        display: "none",
      },
    },
    accordionTitle: {
      fontWeight: "700",
    },
  },

  variants: {
    size: {
      md: {
        trigger: {
          "--font-size": "fontSizes.500",
          "& svg": {
            "--width": "sizes.600",
            "--height": "sizes.600",
          },
        },
        panel: {
          "--padding-top": "spacing.600",
          "--padding-bottom": "spacing.800",
          "--padding-left": "spacing.800",
        },
      },
      sm: {
        trigger: {
          "--font-size": "fontSizes.400",
          "& svg": {
            "--width": "sizes.500",
            "--height": "sizes.500",
          },
        },
        panel: {
          "--padding-top": "spacing.400",
          "--padding-bottom": "spacing.600",
          "--padding-left": "spacing.700",
        },
      },
    },
  },

  defaultVariants: {
    size: "md",
  },
});
