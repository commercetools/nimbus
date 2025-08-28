import { defineSlotRecipe } from "@chakra-ui/react";

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
        // TODO: can't use focusRing prop, find other solution (helper, util, etc.)
        outlineWidth: "var(--focus-ring-width)",
        outlineColor: "var(--focus-ring-color)",
        outlineStyle: "var(--focus-ring-style)",
        outlineOffset: "var(--focus-ring-offset)",
      },

      "& *": {
        outline: "none !important",
      },

      focusVisibleRing: "outside",
      focusRing: "outside",

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
      color: "neutral.11",
      outline: "1px solid red",
      display: "flex",
      alignItems: "center",
    },

    trailingElement: {
      color: "neutral.11",
      outline: "1px solid green",
      display: "flex",
      alignItems: "center",
    },

    input: {
      cursor: "inherit",
      display: "block",
      flexGrow: 1,
      outline: "1px solid orange", // TODO: lol
      bg: "transparent",

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
        input: {},
      },
      md: {
        root: {
          height: "1000",
          px: "400",
          gap: "300",
          textStyle: "md",
        },
        input: {},
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
      ghost: {
        root: {},
      },
    },
  },

  defaultVariants: {
    size: "md",
    variant: "solid",
  },
});
