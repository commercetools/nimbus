import { defineSlotRecipe } from "@chakra-ui/react";

/**
 * Recipe configuration for the TimeInput component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const timeInputRecipe = defineSlotRecipe({
  // Unique class name prefix for the component
  className: "nimbus-time-input",
  slots: ["root", "segmentGroup", "segment"],

  // Base styles applied to all instances of the component
  base: {
    root: {
      display: "inline-block",
    },
    segmentGroup: {
      display: "flex",
      borderRadius: "200",
      bg: "transparent",
      boxShadow: "inset 0 0 0 var(--border-width) var(--border-color)",
      width: "100%",
      alignItems: "center",

      "&[data-focus-within='true']": {
        // TODO: can't use focusRing prop, find other solution (helper, util, etc.)
        outlineWidth: "var(--focus-ring-width)",
        outlineColor: "var(--focus-ring-color)",
        outlineStyle: "var(--focus-ring-style)",
        outlineOffset: "var(--focus-ring-offset)",
      },
      "&[data-invalid='true']": {
        "--border-color": "colors.critical.7",
        color: "critical.11",
      },
      "&[data-disabled='true']": {
        layerStyle: "disabled",
      },
    },
    segment: {
      fontVariantNumeric: "tabular-nums",
      outline: "0",
      px: "50",
      borderRadius: "50",

      "&:empty": {
        border: "1px solid",
      },

      "&[data-focused='true']": {
        bg: "primary.10",
        color: "primary.contrast",
      },

      /**
       * The first and last segment contains a hidden character for screen readers
       * that indicates number reading direction. Since this character is
       * inside a segment element, it creates unwanted padding. This CSS
       * removes the extra padding and aligns the text to match a regular
       * TextInput's text position.
       */
      "&[data-type='literal']&:first-of-type, &[data-type='literal']&:last-of-type":
        {
          px: "0",
          ml: "-50",
        },

      "&[data-type='minute']": {
        // for reference
      },
      "&[data-type='hour']": {
        // for reference
      },
      "&[data-type='dayPeriod']": {
        // for reference
      },
      "&[data-type='timeZoneName']": {
        // for reference
      },
    },
  },

  // Available variants for customizing the component's appearance
  variants: {
    // Size variants from smallest to largest
    size: {
      sm: {
        segmentGroup: {
          h: 800,
          textStyle: "sm",
          px: 300,
        },
      },
      md: {
        segmentGroup: {
          h: 1000,
          textStyle: "md",
          px: 400,
        },
      },
    },
    variant: {
      solid: {
        segmentGroup: {
          "--border-width": "sizes.25",
          "--border-color": "colors.neutral.7",
          backgroundColor: "neutral.1",
          _hover: {
            backgroundColor: "primary.2",
          },
        },
      },
    },
  },
  defaultVariants: {
    size: "md",
    variant: "solid",
  },
});
