import {
  Text as ChakraText,
  type TextProps as ChakraTextProps,
} from "@chakra-ui/react";
import { TextContext, useContextProps } from "react-aria-components";

export interface TextProps extends ChakraTextProps {
  ref?: React.Ref<HTMLParagraphElement>;
}

/**
 * Text
 *
 * Use this component to display text.
 */
export const Text = ({ ref: forwardedRef, ...props }: TextProps) => {
  const [contextProps, ref] = useContextProps(props, forwardedRef, TextContext);
  return <ChakraText ref={ref} {...contextProps} />;
};

Text.displayName = "Text";
