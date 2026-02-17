import { defineRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the Badge component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const badgeRecipe = defineRecipe({
  className: "nimbus-badge",

  // Base styles applied to all instances of the component
  base: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: "400",
    justifyContent: "center",
    whiteSpace: "nowrap",
    verticalAlign: "middle",
    py: "25",
    fontWeight: "400",
    backgroundColor: "colorPalette.3",
    color: "colorPalette.11",
    w: "auto",
    userSelect: "none",
    _icon: {
      flexShrink: "0",
    },
  },

  // Available variants for customizing the component's appearance
  variants: {
    size: {
      "2xs": {
        fontSize: "300",
        gap: "100",
        h: "600",
        lineHeight: "350",
        px: "200",
        _icon: {
          width: "400",
          height: "400",
        },
      },
      xs: {
        fontSize: "350",
        gap: "100",
        h: "800",
        lineHeight: "400",
        px: "300",
        _icon: {
          width: "500",
          height: "500",
        },
      },
      md: {
        fontSize: "400",
        gap: "200",
        h: "1000",
        lineHeight: "500",
        px: "400",
        _icon: {
          width: "600",
          height: "600",
        },
      },
    },
  },

  // Default variant values when not explicitly specified
  defaultVariants: {
    size: "md",
  },
});
