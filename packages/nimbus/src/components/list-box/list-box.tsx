import { ListBoxRoot as _ListBoxRoot } from "./components/list-box.root";
import { ListBoxItem as _ListBoxItem } from "./components/list-box.item";
import { ListBoxItemLabel as _ListBoxItemLabel } from "./components/list-box.item-label";
import { ListBoxItemDescription as _ListBoxItemDescription } from "./components/list-box.item-description";
import { ListBoxSection as _ListBoxSection } from "./components/list-box.section";

/**
 * ListBox
 * ============================================================
 * A selectable list component that allows users to choose one or more
 * options from a list of items. Built with React Aria for accessibility.
 *
 * Usage:
 * ```jsx
 * <ListBox.Root selectionMode="single" onSelectionChange={handleChange}>
 *   <ListBox.Item value="item1">Simple Item</ListBox.Item>
 *   <ListBox.Item value="item2">
 *     <ListBox.ItemLabel>Rich Item</ListBox.ItemLabel>
 *     <ListBox.ItemDescription>With description</ListBox.ItemDescription>
 *   </ListBox.Item>
 *   <ListBox.Section title="More Options">
 *     <ListBox.Item value="item3">Grouped Item</ListBox.Item>
 *   </ListBox.Section>
 * </ListBox.Root>
 * ```
 */
export const ListBox = {
  Root: _ListBoxRoot,
  Item: _ListBoxItem,
  ItemLabel: _ListBoxItemLabel,
  ItemDescription: _ListBoxItemDescription,
  Section: _ListBoxSection,
};

/**
 * todo: get rid of this, this is needed for the react-docgen-typescript script
 * that is parsing the typescript types for our documentation. The _ underscores
 * serve as a reminder that this exports are awkward and should not be used.
 */
export {
  _ListBoxRoot,
  _ListBoxItem,
  _ListBoxItemLabel,
  _ListBoxItemDescription,
  _ListBoxSection,
};
