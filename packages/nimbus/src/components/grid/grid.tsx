import { forwardRef } from "react";
import {
  Grid as ChakraGrid,
  GridItem,
  type GridProps as ChakraGridProps,
} from "@chakra-ui/react";

/**
 * Grid
 * ============================================================
 * The Grid Layout Component provides a flexible and responsive way to structure content using a two-dimensional grid system. It allows elements to be arranged in rows and columns, enabling dynamic and efficient layouts for different screen sizes.
 *
 * Features:
 *
 * - allows forwarding refs to the underlying DOM element
 */
export interface GridProps extends ChakraGridProps {
  children?: React.ReactNode;
}

const GridComponent = forwardRef<HTMLDivElement, GridProps>((props, ref) => {
  return <ChakraGrid ref={ref} {...props} />;
});

GridComponent.displayName = "Grid";

export const Grid = Object.assign(GridComponent, {
  Item: GridItem,
});
