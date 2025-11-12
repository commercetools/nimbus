import { List as ChakraList } from "@chakra-ui/react/list";

/**
 * # ListRoot
 *
 * The root container for list items. Typically rendered as `<ul>` or `<ol>`.
 * Use with `asChild` prop to render as a semantic HTML list element.
 *
 * @supportsStyleProps
 *
 * @example
 * ```tsx
 * <ListRoot asChild>
 *   <ul>
 *     <ListItem>First item</ListItem>
 *     <ListItem>Second item</ListItem>
 *   </ul>
 * </ListRoot>
 * ```
 */
export const ListRoot = ChakraList.Root;
