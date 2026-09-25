import {
  GridItem as ChakraGridItem,
  type GridItemProps as ChakraGridItemProps,
} from "@chakra-ui/react/grid";

export type GridItemProps = ChakraGridItemProps & {
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * Grid.Item - thin, prop-transparent wrapper around Chakra's `GridItem`.
 *
 * Exists purely so `Grid.Item` resolves to a local, documented symbol:
 * `react-docgen-typescript` never documents a component re-exported directly
 * from an external package. Forwards every prop and the ref unchanged, so
 * this has no effect on runtime behaviour or the public type surface.
 *
 * @supportsStyleProps
 */
export const GridItem = ({ ref, ...restProps }: GridItemProps) => {
  return <ChakraGridItem ref={ref} {...restProps} />;
};

GridItem.displayName = "Grid.Item";
