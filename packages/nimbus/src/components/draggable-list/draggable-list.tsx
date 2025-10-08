import { DraggableListRoot } from "./components/draggable-list.root";
import { DraggableListItem } from "./components/draggable-list.item";

/**
 * DraggableList
 * ============================================================
 * A drag-and-drop list component for reordering items.
 * Built with React Aria Components for accessibility and keyboard navigation.
 *
 * Features:
 * - Drag-and-drop reordering with visual feedback
 * - Keyboard navigation support
 * - Controlled and uncontrolled modes
 * - Accessible drag-and-drop interactions
 * - Customizable item rendering
 *
 * **Important:** You must provide either an `aria-label` or `aria-labelledby`
 * prop for accessibility. The drag-and-drop functionality will not work properly
 * without an accessible label.
 *
 * @example
 * ```tsx
 * <DraggableList.Root items={items} aria-label="Task list">
 *   {(item) => (
 *     <DraggableList.Item key={item.id} id={item.id}>
 *       {item.content}
 *     </DraggableList.Item>
 *   )}
 * </DraggableList.Root>
 * ```
 *
 * @see https://react-spectrum.adobe.com/react-aria/dnd.html
 */
export const DraggableList = {
  /**
   * # DraggableList.Root
   *
   * The root component that provides context and drag-and-drop functionality.
   * Manages the state of draggable items and handles reordering logic.
   *
   * This component must wrap all DraggableList.Item components and provides
   * the drag-and-drop context and reordering callbacks.
   *
   * Note: If your items have `key` and `label` properties, you can omit the children
   * prop and the component will render the items automatically.
   *
   * @example
   * ```tsx
   * // With custom children
   * <DraggableList.Root items={items} aria-label="Tasks list">
   *   {(item) => (
   *     <DraggableList.Item key={item.id} id={item.id}>
   *       {item.content}
   *     </DraggableList.Item>
   *   )}
   * </DraggableList.Root>
   *
   * // Without children (items must have key and label)
   * <DraggableList.Root items={itemsWithKeyAndLabel} aria-label="Priority list" />
   * ```
   */
  Root: DraggableListRoot,
  /**
   * # DraggableList.Item
   *
   * An individual draggable item within the list.
   * Handles drag interactions and provides visual feedback during dragging.
   *
   * This component represents a single item in the draggable list and supports
   * drag handles, drag previews, and reordering interactions.
   *
   * @example
   * ```tsx
   * <DraggableList.Root items={items} aria-label="Task list">
   *   {(item) => (
   *     <DraggableList.Item key={item.id} id={item.id}>
   *       <div>{item.title}</div>
   *       <div>{item.description}</div>
   *     </DraggableList.Item>
   *   )}
   * </DraggableList.Root>
   * ```
   */
  Item: DraggableListItem,
};

// Internal exports for react-docgen
export {
  DraggableListRoot as _DraggableListRoot,
  DraggableListItem as _DraggableListItem,
};
