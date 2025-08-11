import { forwardRef } from "react";
import { Table as RaTable } from "react-aria-components";
import { useDataTableContext } from "./data-table.root";

export interface DataTableTableProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const DataTableTable = forwardRef<HTMLTableElement, DataTableTableProps>(
  function DataTableTable({ children, style, ...props }, ref) {
    const {
      sortDescriptor,
      onSortChange,
      selectedKeys,
      defaultSelectedKeys,
      onSelectionChange,
      selectionMode,
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
    const handleAriaSort = (descriptor: any) => {
      if (descriptor && onSortChange) {
        onSortChange({
          column: descriptor.column,
          direction: descriptor.direction,
        });
      }
    };

    return (
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
        style={{
          width: "100%",
          tableLayout: "fixed",
          ...style,
        }}
        {...props}
      >
        {children}
      </RaTable>
    );
  }
);

DataTableTable.displayName = "DataTable.Table"; 