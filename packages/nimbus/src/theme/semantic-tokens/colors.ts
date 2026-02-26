import { defineSemanticTokens } from "@chakra-ui/react/styled-system";
import { themeTokens } from "@commercetools/nimbus-tokens";

export const colors = defineSemanticTokens.colors({
  bg: {
    DEFAULT: {
      value: { _light: "#fff", _dark: "{colors.neutral.1}" },
    },
  },
  fg: {
    DEFAULT: {
      value: "{colors.neutral.12}",
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
      value: "{colors.info.8}",
    },
  },
  ...themeTokens.color["system-palettes"],
  ...themeTokens.color["brand-palettes"],
  ...themeTokens.color["semantic-palettes"],
});

export const darkColors = colors;
