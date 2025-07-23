import { forwardRef, useMemo, useState, createContext, useContext } from "react";
import { ResizableTableContainer } from "react-aria-components";
import { DataTableRoot as DataTableRootSlot } from "../data-table.slots";
import type {
  DataTableProps,
  DataTableColumn,
  DataTableRow as DataTableRowType,
  SortDescriptor,
} from "../data-table.types";
import type { Selection } from "react-aria-components";

// Context for sharing state between DataTable components
interface DataTableContextValue<T = any> {
  // Data & Columns
  columns: DataTableColumn<T>[];
  data: DataTableRowType<T>[];
  visibleColumns?: string[];
  
  // State
  search?: string;
  sortDescriptor?: SortDescriptor;
  selectedKeys?: Selection;
  expanded: Record<string, boolean>;
  
  // Configuration
  allowsSorting?: boolean;
  selectionMode?: "none" | "single" | "multiple";
  disallowEmptySelection?: boolean;
  isRowClickable?: boolean;
  stickyHeader?: boolean;
  isTruncated?: boolean;
  density?: "default" | "condensed";
  nestedKey?: string;
  
  // Event handlers
  onSortChange?: (descriptor: SortDescriptor) => void;
  onSelectionChange?: (keys: Selection) => void;
  onRowClick?: (row: DataTableRowType<T>) => void;
  toggleExpand: (id: string) => void;
  
  // Computed values
  visibleCols: DataTableColumn<T>[];
  filteredRows: DataTableRowType<T>[];
  sortedRows: DataTableRowType<T>[];
  showExpandColumn: boolean;
  showSelectionColumn: boolean;
  
  // Selection helpers
  isSelected: (rowId: string) => boolean;
  isIndeterminate: () => boolean;
  isAllSelected: () => boolean;
  handleRowSelection: (rowId: string, checked: boolean) => void;
  handleSelectAll: (checked: boolean) => void;
}

const DataTableContext = createContext<DataTableContextValue | null>(null);

export const useDataTableContext = <T = any>() => {
  const context = useContext(DataTableContext) as DataTableContextValue<T> | null;
  if (!context) {
    throw new Error("DataTable components must be used within DataTable.Root");
  }
  return context;
};

// Utility functions
function filterRows<T>(
  rows: DataTableRowType<T>[],
  search: string,
  columns: DataTableColumn<T>[],
  nestedKey?: string
): DataTableRowType<T>[] {
  if (!search) return rows;
  const lowerCaseSearch = search.toLowerCase();
  return rows
    .map((row) => {
      const match = columns.some((col) => {
        const value = col.accessor(row);
        return (
          typeof value === "string" &&
          value.toLowerCase().includes(lowerCaseSearch)
        );
      });
      
      if (nestedKey && row[nestedKey]) {
        let nestedContent = row[nestedKey];
        if (Array.isArray(row[nestedKey])) {
          nestedContent = filterRows(row[nestedKey], search, columns, nestedKey);
          if (match || (nestedContent && nestedContent.length > 0)) {
            return { ...row, [nestedKey]: nestedContent };
          }
        } else {
          if (match) {
            return { ...row, [nestedKey]: nestedContent };
          }
        }
        return null;
      } else {
        return match ? row : null;
      }
    })
    .filter(Boolean) as DataTableRowType<T>[];
}

function sortRows<T>(
  rows: DataTableRowType<T>[],
  sortDescriptor: SortDescriptor | undefined,
  columns: DataTableColumn<T>[],
  nestedKey?: string
): DataTableRowType<T>[] {
  if (!sortDescriptor) return rows;

  const column = columns.find((col) => col.id === sortDescriptor.column);
  if (!column) return rows;

  const sortedRows = [...rows].sort((a, b) => {
    const aValue = column.accessor(a);
    const bValue = column.accessor(b);

    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;

    let aSortValue = aValue;
    let bSortValue = bValue;

    if (typeof aValue === "number" && typeof bValue === "number") {
      aSortValue = aValue;
      bSortValue = bValue;
    } else {
      aSortValue = String(aValue).toLowerCase();
      bSortValue = String(bValue).toLowerCase();
    }

    if (aSortValue < bSortValue) return sortDescriptor.direction === "ascending" ? -1 : 1;
    if (aSortValue > bSortValue) return sortDescriptor.direction === "ascending" ? 1 : -1;
    return 0;
  });

  return sortedRows.map((row) => {
    if (!nestedKey || !row[nestedKey]) {
      return row;
    }
    return {
      ...row,
      [nestedKey]: Array.isArray(row[nestedKey])
        ? sortRows(row[nestedKey], sortDescriptor, columns, nestedKey)
        : row[nestedKey],
    };
  });
}

function hasExpandableRows<T>(rows: DataTableRowType<T>[], nestedKey?: string): boolean {
  if (!nestedKey) return false;
  return rows.some(
    (row) =>
      (row[nestedKey] && (
        Array.isArray(row[nestedKey]) ? row[nestedKey].length > 0 : true
      )) ||
      (Array.isArray(row[nestedKey]) && hasExpandableRows(row[nestedKey], nestedKey))
  );
}

export const DataTableRoot = forwardRef<HTMLDivElement, DataTableProps>(
  function DataTableRoot<T = any>(
    props: DataTableProps<T>,
    ref: React.Ref<HTMLDivElement>
  ) {
    const {
      columns,
      data,
      visibleColumns,
      search,
      sortDescriptor: controlledSortDescriptor,
      onSortChange,
      selectedKeys,
      defaultSelectedKeys,
      onSelectionChange,
      selectionMode = "none",
      disallowEmptySelection,
      allowsSorting,
      isRowClickable,
      stickyHeader,
      isTruncated,
      density,
      nestedKey,
      onRowClick,
      children,
      ...rest
    } = props;

    // Internal sorting state
    const [internalSortDescriptor, setInternalSortDescriptor] = useState<
      SortDescriptor | undefined
    >();
    
    // Expanded rows state
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const sortDescriptor = controlledSortDescriptor ?? internalSortDescriptor;

    // Computed values
    const visibleCols = useMemo(
      () =>
        columns.filter(
          (col) =>
            (visibleColumns ? visibleColumns.includes(col.id) : true) &&
            col.isVisible !== false
        ),
      [columns, visibleColumns]
    );

    const filteredRows = useMemo(
      () => (search ? filterRows(data, search, visibleCols, nestedKey) : data),
      [data, search, visibleCols, nestedKey]
    );

    const sortedRows = useMemo(
      () => sortRows(filteredRows, sortDescriptor, visibleCols, nestedKey),
      [filteredRows, sortDescriptor, visibleCols, nestedKey]
    );

    const showExpandColumn = hasExpandableRows(sortedRows, nestedKey);
    const showSelectionColumn = selectionMode !== "none";

    // Event handlers
    const toggleExpand = (id: string) =>
      setExpanded((e) => ({ ...e, [id]: !e[id] }));

    const handleSortChange = (descriptor: SortDescriptor) => {
      if (onSortChange) {
        onSortChange(descriptor);
      } else {
        setInternalSortDescriptor(descriptor);
      }
    };

    // Selection helpers
    const isSelected = (rowId: string) => {
      if (!selectedKeys) return false;
      if (selectedKeys === "all") return true;
      return selectedKeys.has(rowId);
    };

    const isIndeterminate = () => {
      if (!selectedKeys || selectedKeys === "all" || selectionMode !== "multiple") return false;
      const selectedCount = selectedKeys.size;
      const totalCount = sortedRows.length;
      return selectedCount > 0 && selectedCount < totalCount;
    };

    const isAllSelected = () => {
      if (!selectedKeys || selectionMode !== "multiple") return false;
      if (selectedKeys === "all") return true;
      return selectedKeys.size === sortedRows.length && sortedRows.length > 0;
    };

    const handleRowSelection = (rowId: string, checked: boolean) => {
      if (!onSelectionChange) return;
      
      let newSelection: typeof selectedKeys;
      
      if (selectionMode === "single") {
        newSelection = checked ? new Set([rowId]) : new Set();
      } else if (selectionMode === "multiple") {
        const currentSelection = selectedKeys === "all" 
          ? new Set(sortedRows.map(row => row.id))
          : new Set(selectedKeys || []);
        
        if (checked) {
          currentSelection.add(rowId);
        } else {
          currentSelection.delete(rowId);
        }
        
        if (disallowEmptySelection && currentSelection.size === 0) {
          return;
        }
        
        newSelection = currentSelection;
      } else {
        return;
      }
      
      onSelectionChange(newSelection);
    };

    const handleSelectAll = (checked: boolean) => {
      if (!onSelectionChange || selectionMode !== "multiple") return;
      
      if (checked) {
        onSelectionChange(new Set(sortedRows.map(row => row.id)));
      } else {
        if (disallowEmptySelection) return;
        onSelectionChange(new Set());
      }
    };

    const contextValue: DataTableContextValue<T> = {
      // Data & Columns
      columns,
      data,
      visibleColumns,
      
      // State
      search,
      sortDescriptor,
      selectedKeys,
      expanded,
      
      // Configuration
      allowsSorting,
      selectionMode,
      disallowEmptySelection,
      isRowClickable,
      stickyHeader,
      isTruncated,
      density,
      nestedKey,
      
      // Event handlers
      onSortChange: handleSortChange,
      onSelectionChange,
      onRowClick,
      toggleExpand,
      
      // Computed values
      visibleCols,
      filteredRows,
      sortedRows,
      showExpandColumn,
      showSelectionColumn,
      
      // Selection helpers
      isSelected,
      isIndeterminate,
      isAllSelected,
      handleRowSelection,
      handleSelectAll,
    };

    return (
      <DataTableContext.Provider value={contextValue}>
        <DataTableRootSlot 
          ref={ref}
          truncated={isTruncated}
          density={density}
          {...rest}
        >
          <ResizableTableContainer>
            {children}
          </ResizableTableContainer>
        </DataTableRootSlot>
      </DataTableContext.Provider>
    );
  }
);

DataTableRoot.displayName = "DataTable.Root"; 