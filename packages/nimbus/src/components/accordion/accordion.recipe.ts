import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

const accordionVariants = {
  size: {
    md: {
      trigger: {
        "--accordion-font-size": "fontSizes.500",
        "& svg": {
          "--accordion-width": "sizes.600",
          "--accordion-height": "sizes.600",
        },
      },
      panel: {
        "--accordion-padding-top": "spacing.600",
        "--accordion-padding-bottom": "spacing.800",
        "--accordion-padding-left": "spacing.800",
      },
    },
    sm: {
      trigger: {
        "--accordion-font-size": "fontSizes.400",
        "& svg": {
          "--accordion-width": "sizes.500",
          "--accordion-height": "sizes.500",
        },
      },
      panel: {
        "--accordion-padding-top": "spacing.400",
        "--accordion-padding-bottom": "spacing.600",
        "--accordion-padding-left": "spacing.700",
      },
    },
  },
} as const;

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
      fontSize: "var(--accordion-font-size)",
      focusVisibleRing: "outside",
      minHeight: "1200",
      bg: "none",
      flexGrow: 1,
      display: "flex",
      alignItems: "center",
      gap: "8px",
      width: "auto",
      "& svg": {
        width: "var(--accordion-width)",
        height: "var(--accordion-height)",
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
      paddingTop: "var(--accordion-padding-top)",
      paddingBottom: "var(--accordion-padding-bottom)",
      paddingLeft: "var(--accordion-padding-left)",
      '&[aria-hidden="true"]': {
        display: "none",
      },
    },
    accordionTitle: {
      fontWeight: "700",
    },
  },

  variants: accordionVariants,

  defaultVariants: {
    size: "md",
  },
});

export type AccordionSize = keyof typeof accordionVariants.size;
