import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the SearchInput component.
 * Defines the styling variants and base styles using Chakra UI's slot recipe system.
 */
export const searchInputSlotRecipe = defineSlotRecipe({
  slots: ["root", "leadingElement", "input", "clearButton"],
  // Unique class name prefix for the component
  className: "nimbus-search-input",

  // Base styles applied to all instances of the component
  base: {
    root: {
      display: "inline-flex",
      position: "relative",
      cursor: "text",
      borderRadius: "200",
      boxShadow: "inset 0 0 0 var(--border-width) var(--border-color)",
      alignItems: "center",
      _focusWithin: {
        layerStyle: "focusRing",
      },

      _hover: {
        backgroundColor: "primary.2",
      },

      "&[data-invalid='true']": {
        "--border-color": "colors.critical.7",
        "--border-width": "sizes.50",
        color: "critical.11",
      },

      _disabled: {
        bg: "neutral.3",
        layerStyle: "disabled",
      },
    },

    leadingElement: {
      display: "flex",
      alignItems: "center",
      color: "neutral.11",
      pointerEvents: "none",
    },

    input: {
      cursor: "inherit",
      display: "block",
      flexGrow: 1,
      bg: "transparent",
      outline: "none",
      fontSize: "inherit",

      _placeholder: {
        opacity: 0.5,
        color: "currentColor",
      },

      "&::-webkit-search-cancel-button": {
        display: "none",
      },

      "&::-webkit-search-decoration": {
        display: "none",
      },
    },

    clearButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      color: "neutral.11",
      bg: "transparent",
      border: "none",
      borderRadius: "100",
      outline: "none",
      transitionProperty: "colors",
      transitionDuration: "fast",

      _hover: {
        color: "neutral.12",
        backgroundColor: "neutral.4",
      },

      _focusVisible: {
        layerStyle: "focusRing",
      },

      _disabled: {
        opacity: 0.5,
        cursor: "not-allowed",
        pointerEvents: "none",
      },
    },
  },

  variants: {
    size: {
      sm: {
        root: {
          height: "800",
          px: "300",
          gap: "100",
          textStyle: "sm",
        },
        leadingElement: {
          "& > svg": {
            boxSize: "400",
          },
        },
        clearButton: {
          width: "600",
          height: "600",
          "& > svg": {
            boxSize: "350",
          },
        },
      },
      md: {
        root: {
          height: "1000",
          px: "400",
          gap: "200",
          textStyle: "md",
        },
        leadingElement: {
          "& > svg": {
            boxSize: "500",
          },
        },
        clearButton: {
          width: "700",
          height: "700",
          "& > svg": {
            boxSize: "400",
          },
        },
      },
    },

    variant: {
      solid: {
        root: {
          "--border-width": "sizes.25",
          "--border-color": "colors.neutral.7",
          backgroundColor: "primary.1",
        },
      },
      ghost: {},
    },
  },

  defaultVariants: {
    size: "md",
    variant: "solid",
  },
});
