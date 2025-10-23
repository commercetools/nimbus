import {
  Grid as ChakraGrid,
  GridItem,
  type GridProps as ChakraGridProps,
} from "@chakra-ui/react/grid";

/**
 * # Grid
 *
 * An easily customizable Grid component, re-exported from Chakra UI, that provides a consistent layout structure across different products.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/layout/grid}
 */
export type GridProps = ChakraGridProps & {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

const GridComponent = (props: GridProps) => {
  const { ref, ...restProps } = props;
  return <ChakraGrid ref={ref} {...restProps} />;
};

GridComponent.displayName = "Grid";

export const Grid = Object.assign(GridComponent, {
  Item: GridItem,
});
