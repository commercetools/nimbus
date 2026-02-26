import { themeTokens } from "@commercetools/nimbus-tokens";
import { defineTokens } from "@chakra-ui/react/styled-system";

export const colors = defineTokens.colors({
  ...themeTokens.color["blacks-and-whites"],
});

export const darkColors = colors;
