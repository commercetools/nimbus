import type { HTMLChakraProps } from "@chakra-ui/react";

export interface BoxProps extends HTMLChakraProps<"div"> {
  children?: React.ReactNode;
}
