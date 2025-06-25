import {
  Text as ChakraText,
  type TextProps as ChakraTextProps,
} from "@chakra-ui/react";
import { TextContext, useContextProps } from "react-aria-components";

export interface TextProps extends ChakraTextProps {
  ref?: React.Ref<HTMLElement>;
}

/**
 * Text
 *
 * Use this component to display text.
 */
export const Text = ({ ref: forwardedRef, ...props }: TextProps) => {
  const [contextProps, ref] = useContextProps(
    props,
    forwardedRef ?? null,
    TextContext
  );
  return (
    <ChakraText
      ref={ref as React.Ref<HTMLParagraphElement>}
      {...contextProps}
    />
  );
};

Text.displayName = "Text";
