import {
  Stack as ChakraStack,
  type StackProps as ChakraStackProps,
} from "@chakra-ui/react";

export interface StackProps extends ChakraStackProps {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}

export const Stack = (props: StackProps) => {
  const { ref, ...restProps } = props;
  return <ChakraStack ref={ref} {...restProps} />;
};

Stack.displayName = "Stack";
