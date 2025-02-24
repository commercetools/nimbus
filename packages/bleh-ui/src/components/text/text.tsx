import {
  Text as ChakraText,
  type TextProps as ChakraTextProps,
} from "@chakra-ui/react";
import { forwardRef } from "react";

export interface TextProps extends ChakraTextProps {}

/**
 * Render Text
 *
 * Use this component to render text. Various props can be passed to customize the text.
 * Check the documentation for more information.
 *
 * @see https://DOMAIN/components/typography/text
 */
export const Text = forwardRef<HTMLDivElement, TextProps>((props, ref) => {
  return <ChakraText ref={ref} {...props} />;
});

Text.displayName = "Text";
