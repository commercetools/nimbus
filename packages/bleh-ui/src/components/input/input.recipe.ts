import { defineRecipe } from "@chakra-ui/react";

export const inputRecipe = defineRecipe({
  className: "bleh-ui-input",
  base: {
    width: "full",
    minWidth: "0",
    outline: "0",
    position: "relative",
    appearance: "none",
    textAlign: "start",
    _disabled: {
      layerStyle: "disabled",
    },
    height: "var(--input-height)",
    minW: "var(--input-height)",
    "--focus-color": "colors.colorPalette.focusRing",
    "--error-color": "colors.border.error",
    "&::placeholder": {
      color: "colorPalette.11",
      opacity: 3 / 4,
    },
    _invalid: {
      focusRingColor: "var(--error-color)",
      borderColor: "var(--error-color)",
    },
  },
  variants: {
    size: {
      "2xs": {
        textStyle: "xs",
        px: "200",
        "--input-height": "sizes.700",
      },
      xs: {
        textStyle: "xs",
        px: "200",
        "--input-height": "sizes.800",
      },
      sm: {
        textStyle: "sm",
        px: "250",
        "--input-height": "sizes.900",
      },
      md: {
        textStyle: "sm",
        px: "300",
        "--input-height": "sizes.1000",
      },
      lg: {
        textStyle: "md",
        px: "400",
        "--input-height": "sizes.1100",
      },
      xl: {
        textStyle: "md",
        px: "450",
        "--input-height": "sizes.1200",
      },
      "2xl": {
        textStyle: "lg",
        px: "500",
        "--input-height": "sizes.1600",
      },
    },
    variant: {
      outline: {
        bg: "transparent",
        borderWidth: "1px",
        borderColor: "border",
        focusVisibleRing: "inside",
      },
      subtle: {
        borderWidth: "1px",
        borderColor: "transparent",
        bg: "bg.muted",
        focusVisibleRing: "inside",
      },
      flushed: {
        bg: "transparent",
        borderBottomWidth: "1px",
        borderBottomColor: "border",
        px: "0",
        _focusVisible: {
          borderColor: "var(--focus-color)",
          boxShadow: "0px 1px 0px 0px var(--focus-color)",
        },
      },
    },
  },
});
