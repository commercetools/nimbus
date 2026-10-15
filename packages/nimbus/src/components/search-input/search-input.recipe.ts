import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the SearchInput component.
 * Defines the styling variants and base styles using Chakra UI's slot recipe system.
 */
export const searchInputSlotRecipe = defineSlotRecipe({
  slots: ["root", "leadingElement", "trailingElement", "inputWrapper", "input"],
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
    },

    trailingElement: {
      display: "flex",
      alignItems: "center",
      color: "neutral.11",
    },

    inputWrapper: {
      flexGrow: 1,
      // Let the field shrink below the input's default width, so in a narrow
      // field the adornments and the clear button stay inside it.
      minWidth: 0,
      // While empty, hold the clear button's space, so the field keeps the
      // width it has with the button.
      paddingInlineEnd: "var(--search-input-clear-button-space, 0px)",
    },

    input: {
      cursor: "inherit",
      display: "block",
      // Reach into the wrapper's padding, so a placeholder can use the clear
      // button's space. A cyclic percentage counts as `auto` for the field's
      // natural width, which stays the input's default width plus the padding.
      width: "calc(100% + var(--search-input-clear-button-space, 0px))",
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
  },
  variants: {
    size: {
      sm: {
        root: {
          height: "800",
          px: "300",
          gap: "100",
          textStyle: "sm",
          // The clear button (2xs IconButton) and the gap before it.
          "&[data-empty='true']": {
            "--search-input-clear-button-space":
              "calc({sizes.600} + {spacing.100})",
          },
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
          height: "1000",
          px: "400",
          gap: "200",
          textStyle: "md",
          // The clear button (2xs IconButton) and the gap before it.
          "&[data-empty='true']": {
            "--search-input-clear-button-space":
              "calc({sizes.600} + {spacing.200})",
          },
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
          "--border-width": "sizes.25",
          "--border-color": "colors.neutral.7",
          backgroundColor: "neutral.1",
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
