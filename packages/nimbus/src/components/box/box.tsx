import { type HTMLChakraProps } from "@chakra-ui/react/styled-system";
import { Box as ChakraBox } from "@chakra-ui/react/box";

export type BoxProps = HTMLChakraProps<"div"> & {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * # Box
 *
 * A basic layout component that serves as a wrapper or container.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/layout/box}
 */
export const Box = (props: BoxProps) => {
  const { ref, ...restProps } = props;
  return <ChakraBox ref={ref} {...restProps} />;
};

Box.displayName = "Box";
