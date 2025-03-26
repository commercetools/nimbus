import { defineRecipe } from "@chakra-ui/react";

/**
 * Recipe configuration for the Link component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const linkRecipe = defineRecipe({
  className: "bleh-ui-link",
  // Base styles applied to all instances of the component
  base: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: "100",
    borderWidth: "1px",
    borderColor: "transparent",
    focusVisibleRing: "outside",
    bg: "transparent",
    outline: "none",
    cursor: "pointer",
    textDecoration: "underline",
    textUnderlineOffset: "3px",
    _hover: {
      textDecorationThickness: "12%",
    },
  },
  // Available variants for customizing the component's appearance
  variants: {
    // Size variants from smallest to largest
    size: {
      xs: {
        fontSize: "300",
        lineHeight: "400",
        px: "200",
        _hover: {
          // Increased thickness on hover for smallest size
          textDecorationThickness: "13%",
        },
      },
      sm: {
        fontSize: "350",
        lineHeight: "400",
        px: "300",
      },
      md: {
        fontSize: "400",
        lineHeight: "400",
        px: "400",
      },
    },
    // style variants
    fontColor: {
      primary: {
        color: "primary",
      },
      inherit: {
        color: "inherit",
      },
    },
  },
  // Default variant values when not explicitly specified
  defaultVariants: {
    size: "md",
    fontColor: "primary",
  },
});
