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
    tagList: {
      display: "flex",
      flexWrap: "wrap",
      gap: "100",
    },
    tag: {
      colorPalette: "primary",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      alignContent: "center",
      gap: "100",
      borderRadius: "200",
      background: "colorPalette.3",
      fontSize: "400",
      lineHeight: "500",
      focusVisibleRing: "outside",
      "&[data-disabled] &": {
        layerStyle: "disabled",
        pointerEvents: "none",
      },
      "&[data-selected]": {
        background: "colorPalette.9",
        color: "colorPalette.contrast",
        cursor: "button",
      },
      "&[aria-selected]": {
        cursor: "button",
      },
      "& [role='gridcell']": {
        display: "inline-flex !important",
        alignItems: "center",
        justifyContent: "space-between",
        gapX: "100",
      },
    },
  },

  // Available variants for customizing the component's appearance
  variants: {
    // Size variants from smallest to largest
    size: {
      sm: {
        tag: {
          minH: "600",
          paddingX: "200",
          fontSize: "350",
          lineHeight: "400",
        },
      }, // Small
      md: {
        tag: {
          minH: "800",
          paddingX: "200",
          paddingY: "100",
        },
      }, // Medium
      lg: {
        tag: {
          minH: "1000",
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
