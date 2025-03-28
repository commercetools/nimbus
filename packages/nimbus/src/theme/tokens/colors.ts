import { themeTokens } from "@nimbus/tokens";
import { defineTokens } from "@chakra-ui/react";

export const colors = defineTokens.colors({
  ...themeTokens.color["blacks-and-whites"],
});

export const darkColors = colors;
