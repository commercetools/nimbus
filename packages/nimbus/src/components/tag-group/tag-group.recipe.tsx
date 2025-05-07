import { defineSlotRecipe } from "@chakra-ui/react";

/**
 * Recipe configuration for the TagGroup component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const tagGroupSlotRecipe = defineSlotRecipe({
  slots: ["root", "tagList", "tag"],
  // Unique class name prefix for the component
  className: "nimbus-tag-group",

  // Base styles applied to all instances of the component
  base: {
    root: { display: "flex", flexDirection: "column", gapY: "50" },
    tagList: { display: "flex", flexWrap: "wrap", gap: "100" },
    tag: {
      display: "flex",
      alignItems: "center",
      gap: "100",
      borderRadius: "200",
      background: "primary.3",
      border: "solid-25",
      borderColor: "primary.5",
      fontSize: "400",
      lineHeight: "500",
    },
  },

  // Available variants for customizing the component's appearance
  variants: {
    // Size variants from smallest to largest
    size: {
      sm: {
        tag: {
          maxH: "3600",
          paddingX: "200",
          fontSize: "350",
          lineHeight: "400",
        },
      }, // Small
      md: {
        tag: {
          maxH: "3800",
          paddingX: "200",
          paddingY: "100",
        },
      }, // Medium
      lg: {
        tag: {
          maxH: "4000",
          padding: "200",
        },
      }, // Large
    },
  },

  // Default variant values when not explicitly specified
  defaultVariants: {
    size: "lg",
  },
});
