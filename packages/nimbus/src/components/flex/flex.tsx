import { Flex as ChakraFlex } from "@chakra-ui/react/flex";
import type { FlexProps } from "./flex.types";

/**
 * # Flex
 *
 * The Flex component is used to create layouts based on CSS display flex.
 *
 * Built on top of Chakra UI's Flex component with Nimbus theming.
 *
 * @supportsStyleProps
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/layout/flex}
 *
 * @example
 * ```tsx
 * <Flex gap="400" direction="row" align="center">
 *   <Box>Item 1</Box>
 *   <Box>Item 2</Box>
 * </Flex>
 * ```
 */
export const Flex = (props: FlexProps) => {
  const { ref, ...restProps } = props;
  return <ChakraFlex ref={ref} {...restProps} />;
};

Flex.displayName = "Flex";
