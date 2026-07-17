import { ListBoxRoot, ListBoxItem, ListBoxSection } from "./components";

/**
 * # ListBox
 *
 * A standalone selection list component wrapping React Aria's ListBox with
 * Nimbus styling. Supports single and multiple selection, sections, keyboard
 * navigation, drag-and-drop via `dragAndDropHooks`, and virtualization via
 * Virtualizer.
 *
 * @supportsStyleProps
 *
 * @example
 * ```tsx
 * <ListBox.Root selectionMode="multiple" items={items}>
 *   {item => <ListBox.Item>{item.name}</ListBox.Item>}
 * </ListBox.Root>
 * ```
 */
export const ListBox = {
  /**
   * The root container that provides selection state and recipe context.
   */
  Root: ListBoxRoot,

  /**
   * An individual selectable item within the list.
   */
  Item: ListBoxItem,

  /**
   * A labeled group of items within the list.
   */
  Section: ListBoxSection,
};

export {
  ListBoxRoot as _ListBoxRoot,
  ListBoxItem as _ListBoxItem,
  ListBoxSection as _ListBoxSection,
};
