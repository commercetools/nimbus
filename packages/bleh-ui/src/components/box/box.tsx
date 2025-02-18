import { Box as ChakraBox } from "@chakra-ui/react";
import { forwardRef } from "react";
import type { BoxProps } from "./box.types";

export const Box = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
  return <ChakraBox ref={ref} {...props} />;
});

Box.displayName = "Box";
