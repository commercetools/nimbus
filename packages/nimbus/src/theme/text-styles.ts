import { defineTextStyles } from "@chakra-ui/react/styled-system";
import { themeTokens } from "@commercetools/nimbus-tokens";

type TextStylesType = ReturnType<typeof defineTextStyles>;

export const textStyles: TextStylesType = defineTextStyles(
  themeTokens.textStyle
);
