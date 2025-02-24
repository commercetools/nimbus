import { forwardRef } from "react";
import {
  Stack as ChakraStack,
  type StackProps as ChakraStackProps,
} from "@chakra-ui/react";

export interface StackProps extends ChakraStackProps {
  children?: React.ReactNode;
}

export const Stack = forwardRef<HTMLDivElement, StackProps>((props, ref) => {
  return <ChakraStack ref={ref} {...props} />;
});

Stack.displayName = "Stack";