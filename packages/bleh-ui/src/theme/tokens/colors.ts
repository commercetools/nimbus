import { themeTokens } from "@bleh-ui/tokens";
import { defineTokens } from "@chakra-ui/react";

const themeColors = themeTokens.color;

const final = {
  ...themeColors["blacks-and-whites"],
};

console.log("final", final);

export const colors = defineTokens.colors(final);

export const darkColors = colors;
