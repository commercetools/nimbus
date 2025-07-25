import { forwardRef } from "react";
import { Table as AriaTable } from "react-aria-components";
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
      <AriaTable
        ref={ref}
        sortDescriptor={ariaSortDescriptor}
        onSortChange={handleAriaSort}
        style={{
          width: "100%",
          tableLayout: "fixed", // Prevent layout recalculations
          ...style,
        }}
        {...props}
      >
        {children}
      </AriaTable>
    );
  }
);

DataTableTable.displayName = "DataTable.Table"; 