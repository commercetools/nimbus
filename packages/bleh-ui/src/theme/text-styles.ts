import { defineTextStyles } from "@chakra-ui/react";
import { themeTokens } from "@bleh-ui/tokens";

type TextStylesType = ReturnType<typeof defineTextStyles>;

export const textStyles: TextStylesType = defineTextStyles(
  themeTokens.textStyles
);
