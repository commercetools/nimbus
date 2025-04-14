import { defineTextStyles } from "@chakra-ui/react";
import { themeTokens } from "@commercetools/nimbus-tokens";

type TextStylesType = ReturnType<typeof defineTextStyles>;

export const textStyles: TextStylesType = defineTextStyles(
  themeTokens.textStyle
);
