import { defineSemanticTokens } from "@chakra-ui/react";
import { themeTokens } from "@commercetools/nimbus-tokens";

export const colors = defineSemanticTokens.colors({
  bg: {
    DEFAULT: {
      value: {
        _light: "white",
        _dark: "black",
      },
    },
  },
  fg: {
    DEFAULT: {
      value: {
        _light: "black",
        _dark: "white",
      },
    },
  },
  border: {
    DEFAULT: {
      value: "{colors.neutral.6}",
    },
    muted: {
      value: "{colors.neutral.7}",
    },
    subtle: {
      value: "{colors.neutral.6}",
    },
    emphasized: {
      value: "{colors.neutral.8}",
    },
    inverted: {
      value: "{colors.neutral.9}",
    },
    critical: {
      value: "{colors.critical.8}",
    },
    warning: {
      value: "{colors.warning.8}",
    },
    positive: {
      value: "{colors.positive.8}",
    },
    info: {
      value: "{colors.ingo.8}",
    },
  },
  ...themeTokens.color["system-palettes"],
  ...themeTokens.color["brand-palettes"],
  ...themeTokens.color["semantic-palettes"],
});

export const darkColors = colors;
