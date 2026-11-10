import { useEffect, useMemo, useRef } from "react";
import { Table as RaTable, type SortDescriptor } from "react-aria-components";
import { useObjectRef } from "react-aria";
import { mergeRefs } from "@/utils";
import { extractStyleProps } from "@/utils";
import { useLocalizedStringFormatter } from "@/hooks";
import {
  useStableDataTableContext,
  useInteractionContext,
  useTableSelectionContext,
} from "./data-table.context";
import { DataTableTableSlot } from "../data-table.slots";
import type { DataTableTableSlotProps } from "../data-table.types";
import { dataTableMessagesStrings } from "../data-table.messages";

/**
 * DataTable.Table - The main table element that wraps the header and body components
 *
 * @supportsStyleProps
 */
export const DataTableTable = function DataTableTable({
  ref: forwardedRef,
  children,
  "aria-label": ariaLabelProp,
  dragAndDropHooks: dragAndDropHooksProp,
  ...props
}: DataTableTableSlotProps) {
  const localRef = useRef<HTMLTableElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));
  const msg = useLocalizedStringFormatter(dataTableMessagesStrings);
  const {
    onSortChange,
    selectionMode,
    disallowEmptySelection,
    disabledKeys,
    draggableKeys,
    hasRenderNestedContent,
    rows,
    getRowKey,
  } = useStableDataTableContext();
  const { sortDescriptor, expanded } = useInteractionContext();

  // React Aria's `disabledKeys` is an `Iterable<Key>`, so the string "all"
  // would iterate to the keys "a", "l", "l". Expand it to every row id.
  const ariaDisabledKeys = useMemo(
    () =>
      disabledKeys === "all" ? new Set(rows.map(getRowKey)) : disabledKeys,
    [disabledKeys, rows, getRowKey]
  );

  // `draggableKeys` has nothing to restrict without drag and drop. Development
  // only.
  const hasDragAndDropHooks = !!dragAndDropHooksProp;
  const hasDraggableKeys = draggableKeys !== undefined;
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (hasDraggableKeys && !hasDragAndDropHooks) {
      console.warn(
        "[Nimbus] DataTable: `draggableKeys` has no effect without `dragAndDropHooks`. Pass `dragAndDropHooks` from `useDragAndDrop`, or remove `draggableKeys`."
      );
    }
  }, [hasDraggableKeys, hasDragAndDropHooks]);

  // After a drag the browser applies `:hover` at the position where the drag
  // started, until the pointer moves (it sends no mouse events during a drag).
  // The row there is now a different row, so it looks highlighted for no
  // reason. Mark the table from the end of a drag until the next pointer move,
  // so the row hover styles can wait for the pointer.
  useEffect(() => {
    const table = localRef.current;
    if (!hasDragAndDropHooks || !table) return;
    const clear = () => table.removeAttribute("data-hover-suppressed");
    const onDragEnd = () => {
      table.setAttribute("data-hover-suppressed", "");
      document.addEventListener("pointermove", clear, {
        once: true,
        capture: true,
      });
    };
    document.addEventListener("dragend", onDragEnd, true);
    return () => {
      document.removeEventListener("dragend", onDragEnd, true);
      document.removeEventListener("pointermove", clear, true);
      clear();
    };
  }, [hasDragAndDropHooks]);

  // React Aria has no per-row drag switch. Wrap `useDraggableItem` so a row
  // outside `draggableKeys` gets React Aria's own "disabled" result: no drag
  // props, and a drag button with `isDisabled`. The row stays a normal item:
  // focusable, actionable and a valid drop target. The original hook always
  // runs, so the hook order does not change when `draggableKeys` changes.
  const dragAndDropHooks = useMemo(() => {
    const useDraggableItem = dragAndDropHooksProp?.useDraggableItem;
    if (!dragAndDropHooksProp || !useDraggableItem || !draggableKeys) {
      return dragAndDropHooksProp;
    }
    const useDraggableRowItem: typeof useDraggableItem = (props, state) => {
      const result = useDraggableItem(props, state);
      if (draggableKeys.has(String(props.key))) return result;
      return {
        dragProps: {},
        dragButtonProps: { ...result.dragButtonProps, isDisabled: true },
      };
    };
    return { ...dragAndDropHooksProp, useDraggableItem: useDraggableRowItem };
  }, [dragAndDropHooksProp, draggableKeys]);

  const { selectedKeys, defaultSelectedKeys, onSelectionChange } =
    useTableSelectionContext();

  const [styleProps, restProps] = extractStyleProps(props);

  // Use provided aria-label or fall back to default
  const ariaLabel = ariaLabelProp ?? msg.format("dataTable");

  // Convert sort descriptor to react-aria format
  const ariaSortDescriptor = sortDescriptor
    ? {
        column: sortDescriptor.column,
        direction: sortDescriptor.direction,
      }
    : undefined;

  // Handle sort change from react-aria
  const handleAriaSort = (descriptor: SortDescriptor) => {
    if (descriptor && onSortChange) {
      onSortChange({
        column: String(descriptor.column),
        direction: descriptor.direction,
      });
    }
  };

  return (
    <DataTableTableSlot {...styleProps} asChild>
      <RaTable
        ref={ref}
        aria-label={ariaLabel}
        sortDescriptor={ariaSortDescriptor}
        onSortChange={handleAriaSort}
        selectedKeys={selectedKeys}
        defaultSelectedKeys={defaultSelectedKeys}
        onSelectionChange={onSelectionChange}
        selectionMode={selectionMode}
        disallowEmptySelection={disallowEmptySelection}
        disabledKeys={ariaDisabledKeys}
        disabledBehavior="all"
        // nestedKey rows manage expansion internally; only renderNestedContent needs React Aria to track expanded state for aria-expanded
        expandedKeys={hasRenderNestedContent ? expanded : undefined}
        dragAndDropHooks={dragAndDropHooks}
        {...restProps}
      >
        {children}
      </RaTable>
    </DataTableTableSlot>
  );
};

DataTableTable.displayName = "DataTable.Table";
