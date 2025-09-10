import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the NumberInput component.
 * Defines the styling variants and base styles using Chakra UI's slot recipe system.
 */
export const numberInputRecipe = defineSlotRecipe({
  // Unique class name prefix for the component
  className: "nimbus-number-input",

  // Define the slots for this multi-part component
  slots: [
    "root",
    "leadingElement",
    "trailingElement",
    "input",
    "incrementButton",
    "decrementButton",
  ],

  // Base styles applied to all instances of the component
  base: {
    root: {
      display: "inline-flex",
      position: "relative",
      borderRadius: "200",
      pr: "400",
      boxShadow: "inset 0 0 0 var(--border-width) var(--border-color)",
      _focusWithin: {
        layerStyle: "focusRing",
      },

      focusVisibleRing: "outside",
      focusRing: "outside",

      _disabled: {
        layerStyle: "disabled",
        bg: "neutral.3",
      },
      "&[data-invalid='true']": {
        "--border-color": "colors.critical.7",
        color: "critical.11",
      },
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
    input: {
      display: "flex",
      flexGrow: 1,
      flexShrink: 1,
      borderRadius: "inherit",
      colorPalette: "neutral",
      bg: "transparent",
      outline: "none",
      appearance: "textfield",
      _placeholder: {
        opacity: 0.5,
        color: "currentColor",
      },
      "&[data-disabled='true']": {
        layerStyle: "disabled",
        bg: "neutral.3",
      },
      "&[data-invalid='true']": {
        "--border-color": "colors.critical.7",
        color: "critical.11",
      },
    },
    incrementButton: {
      "--border-width": "sizes.25",
      "--border-color": "colors.neutral.7",
      w: 600,
      h: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "button",
      bg: "transparent",
      _active: {
        bg: "neutral.4",
      },
      "&[data-disabled='true']": {
        opacity: 0.5,
        cursor: "not-allowed",
      },
      "& svg": {
        fill: "primary.9",
      },
      borderTopRightRadius: "200",
      "&[data-invalid='true']": {
        "--border-color": "colors.critical.7",
      },
    },
    decrementButton: {
      "--border-width": "sizes.25",
      "--border-color": "colors.neutral.7",
      w: 600,
      h: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "button",
      bg: "transparent",
      _active: {
        bg: "neutral.4",
      },
      "&[data-disabled='true']": {
        opacity: 0.5,
        cursor: "not-allowed",
      },
      "& svg": {
        fill: "primary.9",
      },
      borderBottomRightRadius: "200",
      "&[data-invalid='true']": {
        "--border-color": "colors.critical.7",
      },
    },
  },

  variants: {
    size: {
      sm: {
        input: {
          h: 800,
          textStyle: "sm",
          px: 100,
          pr: 100,
        },
        leadingElement: {
          pl: 300,
          pr: 100,
          minHeight: "400",
          minWidth: "400",
        },
        trailingElement: {
          pr: 500,
          minHeight: "400",
          minWidth: "400",
        },
      },
      md: {
        input: {
          h: 1000,
          textStyle: "md",
          px: 200,
        },
        leadingElement: {
          pl: 400,
          minHeight: "500",
          minWidth: "500",
        },
        trailingElement: {
          pr: 600,
          minHeight: "500",
          minWidth: "500",
        },
      },
    },

    variant: {
      solid: {
        root: {
          // Apply hover effect to root, button color is deeper when hovered
          _hover: {
            backgroundColor: "primary.2",
          },
          "--border-width": "sizes.25",
          "--border-color": "colors.neutral.7",
          backgroundColor: "neutral.1",
        },
        input: {
          "&[data-invalid='true']": {
            boxShadow: "inset 0 0 0 var(--border-width) var(--border-color)",
            "--border-width": "sizes.50",
          },
        },
        incrementButton: {
          "&[data-invalid='true']": {
            borderTop: "2px solid var(--border-color)",
            borderRight: "2px solid var(--border-color)",
          },
          borderTop: "var(--border-width) solid var(--border-color)",
          borderRight: "var(--border-width) solid var(--border-color)",
          borderLeft: "var(--border-width) solid var(--border-color)",
          // Half-pixel shadow to create the illusion of a complete border when paired with the other button
          boxShadow: "inset 0 -0.5px 0 0 var(--border-color)",
          _hover: {
            backgroundColor: "primaryAlpha.4",
          },
        },
        decrementButton: {
          "&[data-invalid='true']": {
            borderBottom: "2px solid var(--border-color)",
            borderRight: "2px solid var(--border-color)",
          },
          borderBottom: "var(--border-width) solid var(--border-color)",
          borderRight: "var(--border-width) solid var(--border-color)",
          borderLeft: "var(--border-width) solid var(--border-color)",
          // Half-pixel shadow to create the illusion of a complete border when paired with the other button
          boxShadow: "inset 0 0.5px 0 0 var(--border-color)",
          _hover: {
            backgroundColor: "primaryAlpha.4",
          },
        },
      },
      ghost: {
        root: {
          // Apply input hover styles when buttons are hovered for ghost variant
          _hover: {
            backgroundColor: "primary.2",
          },
        },
        input: {
          "&[data-invalid='true']": {
            boxShadow: "inset 0 0 0 var(--border-width) var(--border-color)",
            "--border-width": "sizes.50",
          },
        },
        incrementButton: {
          "&[data-invalid='true']": {
            borderTop: "2px solid var(--border-color)",
            borderRight: "2px solid var(--border-color)",
          },
          _hover: {
            backgroundColor: "primaryAlpha.4",
          },
        },
        decrementButton: {
          "&[data-invalid='true']": {
            borderBottom: "2px solid var(--border-color)",
            borderRight: "2px solid var(--border-color)",
          },
          _hover: {
            backgroundColor: "primaryAlpha.4",
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
