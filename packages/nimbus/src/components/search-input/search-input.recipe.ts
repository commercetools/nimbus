import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the SearchInput component.
 * Defines the styling variants and base styles using Chakra UI's slot recipe system.
 */
export const searchInputSlotRecipe = defineSlotRecipe({
  slots: ["root", "leadingElement", "input"],
  // Unique class name prefix for the component
  className: "nimbus-search-input",

  // Base styles applied to all instances of the component
  base: {
    root: {
      display: "inline-flex",
      // Fill the React Aria <SearchField> wrapper so the input stretches to the
      // container width like the other form inputs (TextInput, NumberInput,
      // MoneyInput). Unlike those, SearchInput's styled root is nested inside the
      // SearchField wrapper rather than being the direct flex child, so it can't
      // rely on the parent's `align-items: stretch` and needs an explicit width.
      width: "full",
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
