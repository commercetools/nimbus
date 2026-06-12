/**
 * # Virtualizer
 *
 * A re-export wrapper around React Aria's Virtualizer and its layout classes.
 * Virtualizer renders a scrollable collection of data using customizable
 * layouts. It supports very large collections by only rendering visible items
 * to the DOM, reusing them as the user scrolls.
 *
 * @see https://react-spectrum.adobe.com/react-aria/Virtualizer.html
 *
 * @example
 * ```tsx
 * import { Virtualizer, ListLayout, ListBox } from "@commercetools/nimbus";
 *
 * <Virtualizer layout={ListLayout}>
 *   <ListBox.Root>
 *     {items.map(item => (
 *       <ListBox.Item key={item.id}>{item.name}</ListBox.Item>
 *     ))}
 *   </ListBox.Root>
 * </Virtualizer>
 * ```
 */
export {
  Virtualizer,
  ListLayout,
  GridLayout,
  WaterfallLayout,
  TableLayout,
  Layout,
  LayoutInfo,
  Size,
  Rect,
  Point,
} from "react-aria-components/Virtualizer";
