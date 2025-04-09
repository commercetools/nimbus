import { defineTextStyles } from "@chakra-ui/react";
import { themeTokens } from "@nimbus/tokens";

type TextStylesType = ReturnType<typeof defineTextStyles>;

export const textStyles: TextStylesType = defineTextStyles(
  themeTokens.textStyle
);
