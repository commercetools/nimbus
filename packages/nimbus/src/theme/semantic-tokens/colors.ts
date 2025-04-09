import { defineSemanticTokens } from "@chakra-ui/react";
import { themeTokens } from "@nimbus/tokens";

export const colors = defineSemanticTokens.colors({
  bg: {
    DEFAULT: {
      value: {
        _light: "{colors.neutral.1}",
        _dark: "{colors.neutral.1}",
      },
    },
  },
  fg: {
    DEFAULT: {
      value: {
        _light: "{colors.neutral.12}",
        _dark: "{colors.neutral.12}",
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
    error: {
      value: "{colors.error.8}",
    },
    warning: {
      value: "{colors.danger.8}",
    },
    success: {
      value: "{colors.success.8}",
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
