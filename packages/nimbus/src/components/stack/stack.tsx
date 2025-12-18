import { Stack as ChakraStack } from "@chakra-ui/react/stack";
import type { StackProps } from "./stack.types";

/**
 * # Stack
 *
 * An easily customizable Stack component, re-exported from Chakra UI, that provides a consistent layout structure across different products.
 *
 * @supportsStyleProps
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/layout/stack}
 */
export const Stack = (props: StackProps) => {
  const { ref, ...restProps } = props;
  return <ChakraStack ref={ref} {...restProps} />;
};

Stack.displayName = "Stack";
