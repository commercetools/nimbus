import { forwardRef } from "react";
import { Box as ChakraBox, type HTMLChakraProps } from "@chakra-ui/react";
export interface BoxProps extends HTMLChakraProps<"div"> {
  children?: React.ReactNode;
}

export const Box = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
  return <ChakraBox ref={ref} {...props} />;
});

Box.displayName = "Box";
