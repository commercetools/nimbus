import { defineSlotRecipe } from "@chakra-ui/react";

/**
 * Recipe configuration for the DateInput component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const dateInputSlotRecipe = defineSlotRecipe({
  // Unique class name prefix for the component
  className: "nimbus-date-input",
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
      width: "full",
      alignItems: "center",
      userSelect: "none",
      "&[data-focus-within='true']": {
        // TODO: can't use focusRing prop, find other solution (helper, util, etc.)
        outlineWidth: "var(--focus-ring-width)",
        outlineColor: "var(--focus-ring-color)",
        outlineStyle: "var(--focus-ring-style)",
        outlineOffset: "var(--focus-ring-offset)",
      },
      "&[data-invalid='true']": {
        "--border-width": "sizes.50",
        "--border-color": "colors.critical.7",
        color: "critical.11",
      },
      "&[data-disabled='true']": {
        layerStyle: "disabled",
        bg: "neutral.3",
      },
    },
    segment: {
      fontVariantNumeric: "tabular-nums",
      outline: "0",
      px: "50",
      borderRadius: "50",

      "&:empty": {
        border: "solid-25",
      },

      "&[data-focused='true']": {
        bg: "primary.10",
        color: "primary.contrast",
      },

      "&[data-placeholder='true']:not([data-focused='true']), &[data-type='literal']":
        {
          opacity: 0.5,
        },

      /**
       * The first and last segment contains a hidden character for screen readers
       * that indicates the reading direction. Since this character is
       * inside a segment element, it creates unwanted padding. This CSS
       * removes the extra padding and aligns the text to match a regular
       * TextInput's text position.
       */
      "&[data-type='literal']&:first-of-type, &[data-type='literal']&:last-of-type":
        {
          px: "0",
          ml: "-50",
        },

      "&[data-type='day']": {
        // for reference
      },
      "&[data-type='month']": {
        // for reference
      },
      "&[data-type='year']": {
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
      ghost: {
        segmentGroup: {
          _hover: {
            backgroundColor: "primary.2",
          },
        },
      },
      plain: {
        segmentGroup: {
          px: "0",
          outline: "none!",
          boxShadow: "none!",
        },
      },
    },
  },
  defaultVariants: {
    size: "md",
    variant: "solid",
  },
});
