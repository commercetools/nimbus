import { GridListRoot, GridListItem } from "./components";

/**
 * GridList
 * ============================================================
 * An accessible, keyboard-navigable collection of items in a list or a uniform
 * responsive grid, built on React Aria's GridList. You fill each item with your
 * own content. It supports single and multiple selection, drag-and-drop
 * through `dragAndDropHooks`, and an optional built-in selection checkbox and
 * drag handle.
 *
 * @example
 * ```tsx
 * <GridList.Root aria-label="Photos" layout="grid" columns={{ base: 1, md: 3 }}>
 *   <GridList.Item id="1" textValue="Mountain">Mountain</GridList.Item>
 *   <GridList.Item id="2" textValue="Lake">Lake</GridList.Item>
 * </GridList.Root>
 * ```
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/data-display/grid-list}
 *
 * @experimental This component is experimental and may change or be removed in future versions.
 */
export const GridList = {
  /**
   * # GridList.Root
   *
   * The collection container. Wraps React Aria's `GridList` and owns selection,
   * layout, drag-and-drop, keyboard behavior and the `size` styling context.
   * Must wrap all `GridList.Item` parts.
   */
  Root: GridListRoot,
  /**
   * # GridList.Item
   *
   * A single item. Renders your content. Can show a built-in selection
   * checkbox and a drag handle.
   */
  Item: GridListItem,
};
