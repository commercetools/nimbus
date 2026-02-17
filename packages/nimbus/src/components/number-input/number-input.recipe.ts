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
      overflow: "hidden",
      borderRadius: "200",
      boxShadow: "inset 0 0 0 var(--border-width) var(--border-color)",
      _focusWithin: {
        layerStyle: "focusRing",
      },

      '&[data-disabled="true"]': {
        layerStyle: "disabled",
        bg: "neutral.3",
      },
      "&[data-invalid='true']": {
        "--border-width": "sizes.50",
        "--border-color": "colors.critical.7",
        color: "critical.11",
      },
    },
    leadingElement: {
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      color: "neutral.11",
    },
    trailingElement: {
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      color: "neutral.11",
    },
    input: {
      display: "flex",
      flexGrow: 1,
      flexShrink: 1,
      minWidth: 0,
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
        cursor: "not-allowed",
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
        cursor: "not-allowed",
      },
      _icon: {
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
        cursor: "not-allowed",
      },
      _icon: {
        color: "primary.9",
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
        root: {
          pl: "300",
          pr: "900", // inc+dec-button width + default padding
          gap: "100",
        },
        input: {
          h: "800",
          textStyle: "sm",
        },
        leadingElement: {
          "& > svg": {
            boxSize: "400",
          },
        },
        trailingElement: {
          "& > svg": {
            boxSize: "400",
          },
        },
      },
      md: {
        root: {
          pl: "400",
          pr: "1000", // inc+dec-button width + default padding
          gap: "200",
        },
        input: {
          h: "1000",
          textStyle: "md",
        },
        leadingElement: {
          "& > svg": {
            boxSize: "500",
          },
        },
        trailingElement: {
          "& > svg": {
            boxSize: "500",
          },
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
