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
  ref?: React.Ref<HTMLDivElement>;
}

const GridComponent = (props: GridProps) => {
  const { ref, ...restProps } = props;
  return <ChakraGrid ref={ref} {...restProps} />;
};

GridComponent.displayName = "Grid";

export const Grid = Object.assign(GridComponent, {
  Item: GridItem,
});
