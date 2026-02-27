import { useRef } from "react";
import { Table as RaTable, type SortDescriptor } from "react-aria-components";
import { useObjectRef } from "react-aria";
import { mergeRefs } from "@/utils";
import { extractStyleProps } from "@/utils";
import { useLocalizedStringFormatter } from "@/hooks";
import { useDataTableContext } from "./data-table.context";
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
  ...props
}: DataTableTableSlotProps) {
  const localRef = useRef<HTMLTableElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));
  const msg = useLocalizedStringFormatter(dataTableMessagesStrings);
  const {
    sortDescriptor,
    onSortChange,
    selectionMode,
    onSelectionChange,
    selectedKeys,
    defaultSelectedKeys,
    disallowEmptySelection,
    disabledKeys,
  } = useDataTableContext();

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
        disabledKeys={disabledKeys}
        disabledBehavior="all"
        {...restProps}
      >
        {children}
      </RaTable>
    </DataTableTableSlot>
  );
};

DataTableTable.displayName = "DataTable.Table";
