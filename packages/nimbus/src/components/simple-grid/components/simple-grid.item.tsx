import {
  GridItem as ChakraGridItem,
  type GridItemProps as ChakraGridItemProps,
} from "@chakra-ui/react/grid";

export type SimpleGridItemProps = ChakraGridItemProps & {
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * SimpleGrid.Item - thin, prop-transparent wrapper around Chakra's `GridItem`.
 *
 * Exists purely so `SimpleGrid.Item` resolves to a local, documented symbol:
 * `react-docgen-typescript` never documents a component re-exported directly
 * from an external package. Forwards every prop and the ref unchanged, so
 * this has no effect on runtime behaviour or the public type surface.
 *
 * @supportsStyleProps
 */
export const SimpleGridItem = ({ ref, ...restProps }: SimpleGridItemProps) => {
  return <ChakraGridItem ref={ref} {...restProps} />;
};

SimpleGridItem.displayName = "SimpleGrid.Item";
