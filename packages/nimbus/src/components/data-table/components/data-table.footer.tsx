import { forwardRef } from "react";
import { DataTableFooter as DataTableFooterSlot } from "../data-table.slots";

export interface DataTableFooterProps {
  children?: React.ReactNode;
}

export const DataTableFooter = forwardRef<HTMLDivElement, DataTableFooterProps>(
  function DataTableFooter({ children, ...props }, ref) {
    return (
      <DataTableFooterSlot ref={ref} {...props}>
        {children}
      </DataTableFooterSlot>
    );
  }
);

DataTableFooter.displayName = "DataTable.Footer"; 