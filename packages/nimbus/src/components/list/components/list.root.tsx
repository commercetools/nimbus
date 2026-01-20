import { List as ChakraList } from "@chakra-ui/react/list";

/**
 * # ListRoot
 *
 * The root container for list items. Renders as `<ul>` by default.
 * Use the `as="ol"` prop to render as an ordered list.
 *
 * @supportsStyleProps
 *
 * @example
 * ```tsx
 * // Unordered list (default)
 * <ListRoot>
 *   <ListItem>First item</ListItem>
 *   <ListItem>Second item</ListItem>
 * </ListRoot>
 *
 * // Ordered list
 * <ListRoot as="ol">
 *   <ListItem>First item</ListItem>
 *   <ListItem>Second item</ListItem>
 * </ListRoot>
 * ```
 */
export const ListRoot = ChakraList.Root;
