import { defineRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the Link component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const linkRecipe = defineRecipe({
  className: "nimbus-link",
  // Base styles applied to all instances of the component
  base: {
    display: "inline-flex",
    alignItems: "center",
    color: "colorPalette.11",
    borderRadius: "100",
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
        lineHeight: "450",
      },
      sm: {
        fontSize: "350",
        lineHeight: "500",
      },
      md: {
        fontSize: "400",
        lineHeight: "600",
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
});

// ============================================================
// EXPORTED VARIANT TYPES
// ============================================================

const linkVariants = linkRecipe.variants!;

export type LinkSize = keyof typeof linkVariants.size;
export type LinkFontColor = keyof typeof linkVariants.fontColor;
