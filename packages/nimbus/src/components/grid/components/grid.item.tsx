import { forwardRef } from "react";
import { GridItem as ChakraGridItem } from "@chakra-ui/react";
import type { GridItemProps } from "../grid.types";

export const GridItem = forwardRef<HTMLDivElement, GridItemProps>(
  (props, ref) => {
    return <ChakraGridItem ref={ref} {...props} />;
  }
);

GridItem.displayName = "GridItem";
