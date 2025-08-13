import { forwardRef } from "react";
import { Table as RaTable, type SortDescriptor } from "react-aria-components";
import { useDataTableContext } from "./data-table.context";
import {
  DataTableTableSlot,
  type DataTableTableSlotProps,
} from "../data-table.slots";

export const DataTableTable = forwardRef<
  HTMLTableElement,
  DataTableTableSlotProps
>(function DataTableTable({ children, ...props }, ref) {
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
    <DataTableTableSlot {...props} asChild>
      <RaTable
        ref={ref}
        sortDescriptor={ariaSortDescriptor}
        onSortChange={handleAriaSort}
        selectedKeys={selectedKeys}
        defaultSelectedKeys={defaultSelectedKeys}
        onSelectionChange={onSelectionChange}
        selectionMode={selectionMode}
        disallowEmptySelection={disallowEmptySelection}
        disabledKeys={disabledKeys}
        disabledBehavior="all"
        {...props}
      >
        {children}
      </RaTable>
    </DataTableTableSlot>
  );
});

DataTableTable.displayName = "DataTable.Table";
