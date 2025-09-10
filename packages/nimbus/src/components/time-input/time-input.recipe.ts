import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the TimeInput component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const timeInputRecipe = defineSlotRecipe({
  // Unique class name prefix for the component
  className: "nimbus-time-input",
  slots: [
    "root",
    "leadingElement",
    "trailingElement",
    "segmentGroup",
    "segment",
  ],

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
      focusVisibleRing: "outside",
      focusRing: "outside",
      "& input": {
        outline: "none",
      },
      "&[data-invalid='true']": {
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
      flex: "0 0 auto",
      borderRadius: "inherit",
      bg: "transparent",
      alignItems: "center",
    },
    leadingElement: {
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
    },
    trailingElement: {
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
    },
    segment: {
      fontVariantNumeric: "tabular-nums",
      px: "50",
      "&:empty": {
        border: "1px solid",
      },

      "&[data-focused='true']": {
        bg: "primary.10",
        color: "primary.contrast",
      },

      "&[data-placeholder='true']:not([data-focused='true'])": {
        opacity: 0.5,
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
        root: {
          h: 800,
          gap: 100,
          px: 300,
        },
        segment: {
          textStyle: "sm",
        },
        leadingElement: {
          minHeight: "400",
          minWidth: "400",
        },
        trailingElement: {
          minHeight: "400",
          minWidth: "400",
        },
      },
      md: {
        root: {
          h: 1000,
          gap: 200,
          px: 400,
        },
        segment: {
          textStyle: "md",
        },
        leadingElement: {
          minHeight: "500",
          minWidth: "500",
        },
        trailingElement: {
          minHeight: "500",
          minWidth: "500",
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
    },
  },
  defaultVariants: {
    size: "md",
    variant: "solid",
  },
});
