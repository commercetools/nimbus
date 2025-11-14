import {
  Text as ChakraText,
  type TextProps as ChakraTextProps,
} from "@chakra-ui/react/text";
import { TextContext, useContextProps } from "react-aria-components";

export type TextProps = Omit<ChakraTextProps, "slot"> & {
  ref?: React.Ref<HTMLElement>;
  slot?: string | null | undefined;
};

/**
 * # Text
 *
 * the Text component is used to display text
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/typography/text}
 *
 * @supportsStyleProps
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
      slot={props.slot ?? undefined}
    />
  );
};

Text.displayName = "Text";
