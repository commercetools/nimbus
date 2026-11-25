import type { DragAndDropHooks } from "react-aria-components";

/**
 * Whether a row cannot start a drag because `draggableKeys` does not list it.
 * Without `draggableKeys` this returns `false`, so tables without it keep
 * their behaviour.
 *
 * Disabled rows (`disabledKeys`, `isDisabled`) are not checked here: React
 * Aria already refuses to drag them, and a listed disabled row keeps its
 * visible (disabled) drag handle.
 */
export function isRowDragDisabled({
  rowKey,
  draggableKeys,
}: {
  rowKey: string;
  draggableKeys?: ReadonlySet<string>;
}): boolean {
  return draggableKeys !== undefined && !draggableKeys.has(rowKey);
}

type UseDraggableItem = NonNullable<DragAndDropHooks["useDraggableItem"]>;

/**
 * Wraps React Aria's `useDraggableItem` so a row that
 * `isRowDragDisabled` rejects gets React Aria's own "disabled" result: no
 * drag props, and a drag button with `isDisabled`. The row stays a normal
 * collection item: focusable, actionable and a valid drop target.
 *
 * The original hook always runs, so the hook order does not change when
 * `draggableKeys` changes. The disabled shape mirrors React Aria's
 * `useDraggableItem` (react-aria `dnd/useDraggableItem`); the unit test
 * compares the two, so a React Aria upgrade that changes it fails there.
 */
export function restrictDraggableItem(
  useDraggableItem: UseDraggableItem,
  draggableKeys: ReadonlySet<string>
): UseDraggableItem {
  return (props, state) => {
    const result = useDraggableItem(props, state);
    if (!isRowDragDisabled({ rowKey: String(props.key), draggableKeys })) {
      return result;
    }
    return {
      dragProps: {},
      dragButtonProps: { ...result.dragButtonProps, isDisabled: true },
    };
  };
}
