import { defineRecipe } from "@chakra-ui/react";

export const buttonRecipe = defineRecipe({
  className: "bleh-ui-button",
  base: {
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
    fontWeight: "semibold",
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
        h: "6",
        minW: "6",
        textStyle: "xs",
        px: "200",
        gap: "100",
        _icon: {
          width: "3.5",
          height: "3.5",
        },
      },
      xs: {
        h: "8",
        minW: "8",
        textStyle: "xs",
        px: "250",
        gap: "100",
        _icon: {
          width: "4",
          height: "4",
        },
      },
      sm: {
        h: "9",
        minW: "9",
        px: "350",
        textStyle: "sm",
        gap: "200",
        _icon: {
          width: "4",
          height: "4",
        },
      },
      md: {
        h: "10",
        minW: "10",
        textStyle: "sm",
        px: "400",
        gap: "200",
        _icon: {
          width: "5",
          height: "5",
        },
      },
      lg: {
        h: "11",
        minW: "11",
        textStyle: "md",
        px: "500",
        gap: "300",
        _icon: {
          width: "5",
          height: "5",
        },
      },
      xl: {
        h: "12",
        minW: "12",
        textStyle: "md",
        px: "500",
        gap: "250",
        _icon: {
          width: "5",
          height: "5",
        },
      },
      "2xl": {
        h: "16",
        minW: "16",
        textStyle: "lg",
        px: "700",
        gap: "300",
        _icon: {
          width: "6",
          height: "6",
        },
      },
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
      plain: {
        color: "colorPalette.11",
      },
    },
  },
  defaultVariants: {
    size: "md",
    variant: "subtle",
  },
});
