import { forwardRef } from "react";
import {
  SimpleGrid as ChakraSimpleGrid,
  GridItem,
  type SimpleGridProps as ChakraSimpleGridProps,
} from "@chakra-ui/react";

/**
 * SimpleGrid
 * ============================================================
 * The SimpleGrid Layout Component provides a flexible and responsive way to structure content.
 *
 * Features:
 *
 * - allows forwarding refs to the underlying DOM element
 */
export interface SimpleGridProps extends ChakraSimpleGridProps {
  children?: React.ReactNode;
}

const GridComponent = forwardRef<HTMLDivElement, SimpleGridProps>((props, ref) => {
  return <ChakraSimpleGrid ref={ref} {...props} />;
});

GridComponent.displayName = "SimpleGrid";

export const SimpleGrid = Object.assign(GridComponent, {
  Item: GridItem,
});
