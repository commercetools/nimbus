import { useMemo, useRef } from "react";
import { Table as RaTable, type SortDescriptor } from "react-aria-components";
import { useObjectRef } from "react-aria";
import { mergeRefs } from "@/utils";
import { extractStyleProps } from "@/utils";
import { useLocalizedStringFormatter } from "@/hooks";
import {
  useDataTableContext,
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
  dragAndDropHooks,
  ...props
}: DataTableTableSlotProps) {
  const localRef = useRef<HTMLTableElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));
  const msg = useLocalizedStringFormatter(dataTableMessagesStrings);
  const {
    sortDescriptor,
    onSortChange,
    selectionMode,
    selectionBehavior,
    disallowEmptySelection,
    disabledKeys,
    hasRenderNestedContent,
    expanded,
    rows,
    getRowKey,
  } = useDataTableContext();

  // React Aria's `disabledKeys` is an `Iterable<Key>`, so the string "all"
  // would iterate to the keys "a", "l", "l". Expand it to every row id.
  const ariaDisabledKeys = useMemo(
    () =>
      disabledKeys === "all" ? new Set(rows.map(getRowKey)) : disabledKeys,
    [disabledKeys, rows, getRowKey]
  );

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
        selectionBehavior={selectionBehavior}
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
