import { GridListRoot, GridListItem } from "./components";

/**
 * # GridList
 *
 * A standalone interactive list component wrapping React Aria's GridList with
 * Nimbus styling. Supports single and multiple selection, keyboard navigation,
 * drag-and-drop via `dragAndDropHooks`, and type-ahead search.
 *
 * Unlike `ListBox` (which renders `role="listbox"` / `role="option"`),
 * `GridList` renders `role="grid"` / `role="row"` and is designed for
 * rows that contain interactive elements (buttons, links, checkboxes).
 *
 * @supportsStyleProps
 *
 * @example
 * ```tsx
 * <GridList.Root selectionMode="multiple" items={items}>
 *   {item => <GridList.Item>{item.name}</GridList.Item>}
 * </GridList.Root>
 * ```
 */
export const GridList = {
  /**
   * The root container that provides selection state and recipe context.
   */
  Root: GridListRoot,

  /**
   * An individual interactive row within the list.
   */
  Item: GridListItem,
};

export { GridListRoot as _GridListRoot, GridListItem as _GridListItem };
