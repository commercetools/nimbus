import type { ReactElement } from "react";
import { Box as ChakraBox } from "@chakra-ui/react";
import type { BoxProps } from "./box.types";

export const Box = (props: BoxProps): ReactElement => {
  return <ChakraBox {...props} />;
};

Box.displayName = "Box";
