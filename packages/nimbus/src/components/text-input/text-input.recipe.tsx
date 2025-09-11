import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the TextInput component.
 * Defines the styling variants and base styles using Chakra UI's slot recipe system.
 */
export const textInputSlotRecipe = defineSlotRecipe({
  slots: ["root", "leadingElement", "input", "trailingElement"],
  // Unique class name prefix for the component
  className: "nimbus-text-input",

  // Base styles applied to all instances of the component
  base: {
    root: {
      display: "inline-flex",
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
    },
  },

  variants: {
    size: {
      sm: {
        root: {
          height: "800",
          px: "300",
          gap: "200",
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
          height: "1000",
          px: "400",
          gap: "300",
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
