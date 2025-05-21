import { forwardRef } from "react";
import { Grid as ChakraGrid } from "@chakra-ui/react";
import type { GridRootProps } from "../grid.types";

export const GridRoot = forwardRef<HTMLDivElement, GridRootProps>(
  (props, ref) => {
    return <ChakraGrid ref={ref} {...props} />;
  }
);

GridRoot.displayName = "GridRoot";
