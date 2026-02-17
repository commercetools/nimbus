import { defineRecipe } from "@chakra-ui/react/styled-system";

export const buttonRecipe = defineRecipe({
  className: "nimbus-button",
  base: {
    borderRadius: "200",
    display: "inline-flex",
    appearance: "none",
    alignItems: "center",
    justifyContent: "center",
    userSelect: "none",
    position: "relative",
    whiteSpace: "nowrap",
    verticalAlign: "middle",
    borderWidth: "1px",
    borderColor: "transparent",
    cursor: "button",
    flexShrink: "0",
    outline: "0",
    lineHeight: "1.2",
    isolation: "isolate",
    fontWeight: "500",
    transitionProperty: "common",
    transitionDuration: "moderate",
    focusVisibleRing: "outside",
    _disabled: {
      layerStyle: "disabled",
    },
    _icon: {
      flexShrink: "0",
    },
  },
  variants: {
    size: {
      "2xs": {
        h: "600",
        minW: "600",
        fontSize: "300",
        fontWeight: "500",
        lineHeight: "400",
        px: "200",
        gap: "100",
        _icon: {
          width: "400",
          height: "400",
        },
      },
      xs: {
        h: "800",
        minW: "800",
        fontSize: "350",
        fontWeight: "500",
        lineHeight: "400",
        px: "300",
        gap: "100",
        _icon: {
          width: "500",
          height: "500",
        },
      },
      sm: {
        h: "900",
        minW: "900",
        px: "350",
        fontSize: "350",
        lineHeight: "400",
        gap: "200",
        _icon: {
          width: "500",
          height: "500",
        },
      },
      md: {
        h: "1000",
        minW: "1000",
        fontSize: "400",
        lineHeight: "500",
        px: "400",
        gap: "200",
        _icon: {
          width: "600",
          height: "600",
        },
      },
      /*  lg: {
        h: "1100",
        minW: "1100",
        textStyle: "md",
        px: "500",
        gap: "300",
        _icon: {
          width: "500",
          height: "500",
        },
      }, */
      /*  xl: {
        h: "1200",
        minW: "1200",
        textStyle: "md",
        px: "500",
        gap: "250",
        _icon: {
          width: "500",
          height: "500",
        },
      }, */
      /* "2xl": {
        h: "1600",
        minW: "1600",
        textStyle: "lg",
        px: "700",
        gap: "300",
        _icon: {
          width: "600",
          height: "600",
        },
      }, */
    },
    variant: {
      solid: {
        bg: "colorPalette.9",
        color: "colorPalette.contrast",
        _hover: {
          bg: "colorPalette.10",
        },
        _expanded: {
          bg: "colorPalette.10",
        },
      },
      subtle: {
        bg: "colorPalette.3",
        color: "colorPalette.11",
        _hover: {
          bg: "colorPalette.4",
        },
        _expanded: {
          bg: "colorPalette.4",
        },
      },
      outline: {
        borderWidth: "1px",
        borderColor: "colorPalette.7",
        color: "colorPalette.11",
        transitionProperty: "background-color, border-color, color",
        transitionDuration: "moderate",
        _hover: {
          bg: "colorPalette.3",
          borderColor: "colorPalette.8",
        },
        _expanded: {
          bg: "colorPalette.subtle",
        },
      },
      ghost: {
        color: "colorPalette.11",
        _hover: {
          bg: "colorPalette.4",
        },
        _expanded: {
          bg: "colorPalette.4",
        },
      },
      link: {
        color: "colorPalette.11",
        _hover: {
          textDecoration: "underline",
        },
      },
    },
  },
  defaultVariants: {
    size: "md",
    variant: "subtle",
  },
});
