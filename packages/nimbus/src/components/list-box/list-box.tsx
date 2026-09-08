import {
  ListBoxRoot,
  ListBoxItem,
  ListBoxSection,
  ListBoxLoadMore,
} from "./components";

/**
 * ListBox
 * ============================================================
 * An accessible selection list built on React Aria's ListBox. Renders a list of
 * options the user can select one or many of, with keyboard navigation,
 * type-ahead, sections, rich item content, drag-and-drop, and empty / loading /
 * disabled states.
 *
 * It works standalone (settings/filter lists, pickers, command palettes) and is
 * the reusable building block behind overlay selection surfaces.
 *
 * @example
 * ```tsx
 * <ListBox.Root aria-label="Favorite fruit" selectionMode="single">
 *   <ListBox.Item id="apple">Apple</ListBox.Item>
 *   <ListBox.Item id="banana">Banana</ListBox.Item>
 *   <ListBox.Item id="cherry">Cherry</ListBox.Item>
 * </ListBox.Root>
 * ```
 *
 * @see https://nimbus-documentation.vercel.app/components/lists/list-box
 */
export const ListBox = {
  /**
   * # ListBox.Root
   *
   * The collection container. Wraps React Aria's `ListBox` and owns selection,
   * sections, drag-and-drop, keyboard behaviour, and the `variant` / `size` /
   * `density` styling context. Must wrap all `ListBox.Item` and
   * `ListBox.Section` parts.
   */
  Root: ListBoxRoot,
  /**
   * # ListBox.Item
   *
   * A single selectable option. Single-select shows a full-row highlight;
   * multi-select renders a leading checkbox. Supports `leading` media,
   * `trailing` content, and `Text` label/description slots.
   */
  Item: ListBoxItem,
  /**
   * # ListBox.Section
   *
   * A labelled group of options. Its `label` renders as an accessible section
   * header.
   */
  Section: ListBoxSection,
  /**
   * # ListBox.LoadMore
   *
   * An async load-more sentinel that shows a loading spinner row while
   * `isLoading` is true — for infinite / paginated lists.
   */
  LoadMore: ListBoxLoadMore,
};
