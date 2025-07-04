import { defineSlotRecipe } from "@chakra-ui/react";

/**
 * Recipe configuration for the NumberInput component.
 * Defines the styling variants and base styles using Chakra UI's slot recipe system.
 */
export const numberInputRecipe = defineSlotRecipe({
  // Unique class name prefix for the component
  className: "nimbus-number-input",

  // Define the slots for this multi-part component
  slots: ["root", "input", "incrementButton", "decrementButton"],

  // Base styles applied to all instances of the component
  base: {
    root: {
      display: "inline-block",
      position: "relative",
      // Apply input hover styles when buttons are hovered
      "&:has(button:hover) input": {
        backgroundColor: "primary.2",
      },
    },
    input: {
      "--border-width": "sizes.25",
      "--border-color": "colors.neutral.7",
      display: "block",
      borderRadius: "200",
      colorPalette: "neutral",
      focusVisibleRing: "outside",
      bg: "transparent",
      outline: "none",
      appearance: "textfield",
      width: "full",
      _placeholder: {
        opacity: 0.5,
        color: "currentColor",
      },
      _disabled: {
        layerStyle: "disabled",
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
      _hover: {
        bg: "primary.2",
      },
      _active: {
        bg: "neutral.4",
      },
      _disabled: {
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
      _hover: {
        bg: "primary.2",
      },
      _active: {
        bg: "neutral.4",
      },
      _disabled: {
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
          px: 300,
          paddingRight: 800,
        },
      },
      md: {
        input: {
          h: 1000,
          textStyle: "md",
          px: 400,
          paddingRight: 800,
        },
      },
    },

    variant: {
      solid: {
        root: {
          // Apply input hover styles when buttons are hovered for solid variant
          "&:has(button:hover) input": {
            backgroundColor: "primary.2",
          },
        },
        input: {
          "&[data-invalid='true']": {
            boxShadow: "inset 0 0 0 var(--border-width) var(--border-color)",
            "--border-width": "sizes.50",
          },
          boxShadow: "inset 0 0 0 var(--border-width) var(--border-color)",
          backgroundColor: "neutral.1",
          _hover: {
            backgroundColor: "primary.2",
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
            backgroundColor: "primaryAlpha.3",
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
            backgroundColor: "primaryAlpha.3",
          },
        },
      },
      ghost: {
        root: {
          // Apply input hover styles when buttons are hovered for ghost variant
          "&:has(button:hover) input": {
            backgroundColor: "primary.2",
          },
        },
        input: {
          "&[data-invalid='true']": {
            boxShadow: "inset 0 0 0 var(--border-width) var(--border-color)",
            "--border-width": "sizes.50",
          },
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
            backgroundColor: "primaryAlpha.3",
          },
        },
        decrementButton: {
          "&[data-invalid='true']": {
            borderBottom: "2px solid var(--border-color)",
            borderRight: "2px solid var(--border-color)",
          },
          _hover: {
            backgroundColor: "primaryAlpha.3",
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
