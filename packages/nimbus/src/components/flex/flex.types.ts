import type { FlexProps as ChakraFlexProps } from "@chakra-ui/react";

/**
 * Props for the Flex component
 *
 * Inherits all props from Chakra UI's Flex component, including:
 * - Layout props: direction, wrap, align, justify, gap
 * - Style props: padding, margin, backgroundColor, etc.
 * - Responsive props: All props support responsive objects
 *
 * @example
 * ```tsx
 * <Flex gap="400" direction="row" align="center">
 *   <Box>Item 1</Box>
 *   <Box>Item 2</Box>
 * </Flex>
 * ```
 */
export type FlexProps = ChakraFlexProps & {
  /**
   * Ref forwarding to the root flex element
   */
  ref?: React.Ref<HTMLDivElement>;
};
