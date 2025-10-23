import {
  SimpleGrid as ChakraSimpleGrid,
  type SimpleGridProps as ChakraSimpleGridProps,
} from "@chakra-ui/react/simple-grid";

import { GridItem } from "@chakra-ui/react/grid";

/**
 * # SimpleGrid
 *
 * displays a simple grid / matrix
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/layout/simplegrid}
 */
export type SimpleGridProps = ChakraSimpleGridProps & {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

const GridComponent = (props: SimpleGridProps) => {
  const { ref, ...restProps } = props;
  return <ChakraSimpleGrid ref={ref} {...restProps} />;
};

GridComponent.displayName = "SimpleGrid";

export const SimpleGrid = Object.assign(GridComponent, {
  Item: GridItem,
});
