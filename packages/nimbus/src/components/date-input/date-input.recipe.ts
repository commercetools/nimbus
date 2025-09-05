import { defineSlotRecipe } from "@chakra-ui/react";

/**
 * Recipe configuration for the DateInput component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const dateInputSlotRecipe = defineSlotRecipe({
  // Unique class name prefix for the component
  className: "nimbus-date-input",
  slots: ["root", "leadingElement", "segmentGroup", "segment"],

  // Base styles applied to all instances of the component
  base: {
    root: {
      display: "inline-flex",
      borderRadius: "200",
      alignItems: "center",
      boxShadow: "inset 0 0 0 var(--border-width) var(--border-color)",
      _focusWithin: {
        layerStyle: "focusRing",
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
    segmentGroup: {
      display: "flex",
      flexGrow: 1,
      borderRadius: "inherit",
      bg: "transparent",
      alignItems: "center",
    },
    leadingElement: {
      color: "neutral.11",
      display: "flex",
      alignItems: "center",
    },
    segment: {
      fontVariantNumeric: "tabular-nums",
      px: "50",
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
        root: {
          h: 800,
          textStyle: "sm",
          px: 300,
          gap: 100
        },
        leadingElement: {
          "& > *": {
            h: "400",
            w: "400",
          },
        },
      },
      md: {
        root: {
          h: 1000,
          textStyle: "md",
          px: 400,
          gap: 200,
        },
        leadingElement: {
          "& > *": {
            h: "500",
            w: "500",
          },
        },
      },
    },
    variant: {
      solid: {
        root: {
          "--border-width": "sizes.25",
          "--border-color": "colors.neutral.7",
          backgroundColor: "neutral.1",
          _hover: {
            backgroundColor: "primary.2",
          },
        },
      },
      ghost: {
        root: {
          _hover: {
            backgroundColor: "primary.2",
          },
        },
      },
      plain: {
        root: {
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
