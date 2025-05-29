import {
  Text as ChakraText,
  type TextProps as ChakraTextProps,
} from "@chakra-ui/react";

export interface TextProps extends ChakraTextProps {
  ref?: React.Ref<HTMLParagraphElement>;
}

/**
 * Render Text
 *
 * Use this component to render text. Various props can be passed to customize the text.
 * Check the documentation for more information.
 *
 * @see https://DOMAIN/components/typography/text
 */
export const Text = (props: TextProps) => {
  const { ref, ...restProps } = props;
  return <ChakraText ref={ref} {...restProps} />;
};

Text.displayName = "Text";
