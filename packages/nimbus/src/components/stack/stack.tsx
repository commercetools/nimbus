import {
  Stack as ChakraStack,
  type StackProps as ChakraStackProps,
} from "@chakra-ui/react";

export interface StackProps extends ChakraStackProps {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * # Stack
 *
 * An easily customizable Stack component, re-exported from Chakra UI, that provides a consistent layout structure across different products.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/layout/stack}
 */
export const Stack = (props: StackProps) => {
  const { ref, ...restProps } = props;
  return <ChakraStack ref={ref} {...restProps} />;
};

Stack.displayName = "Stack";
