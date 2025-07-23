import { forwardRef, useMemo, useState } from "react";
import {
  DataTableRoot,
  DataTableFooter,
  DataTableExpandButton,
  // DataTableDetailsButton,
  // DataTableNestedIcon,
} from "./data-table.slots";
import type {
  DataTableProps,
  DataTableColumn,
  DataTableRow as DataTableRowType,
  SortDescriptor,
} from "./data-table.types";

import {
  Table,
  TableHeader as AriaTableHeader,
  TableBody as AriaTableBody,
  Row as AriaRow,
  Cell as AriaCell,
  Column as AriaColumn,
  ResizableTableContainer,
  ColumnResizer,
} from "react-aria-components";
import { Highlight } from "@chakra-ui/react";

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
      
      // Only filter nested content if nestedKey is provided and exists
      if (nestedKey && row[nestedKey]) {
        let nestedContent = row[nestedKey];
        if (Array.isArray(row[nestedKey])) {
          nestedContent = filterRows(row[nestedKey], search, columns, nestedKey);
          if (match || (nestedContent && nestedContent.length > 0)) {
            return { ...row, [nestedKey]: nestedContent };
          }
        } else {
          // For React node nested content, just include them if parent matches
          if (match) {
            return { ...row, [nestedKey]: nestedContent };
          }
        }
        return null;
      } else {
        // No nested key or nested content, just return if parent matches
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

    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;

    // Convert to strings for comparison if they're not numbers
    let aSortValue = aValue;
    let bSortValue = bValue;

    if (typeof aValue === "number" && typeof bValue === "number") {
      // Numeric comparison
      aSortValue = aValue;
      bSortValue = bValue;
    } else {
      // String comparison
      aSortValue = String(aValue).toLowerCase();
      bSortValue = String(bValue).toLowerCase();
    }

    if (aSortValue < bSortValue) return sortDescriptor.direction === "ascending" ? -1 : 1;
    if (aSortValue > bSortValue) return sortDescriptor.direction === "ascending" ? 1 : -1;
    return 0;
  });

  // Recursively sort nested content only if nestedKey is provided and they are an array of DataTableRow
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

export const DataTable = forwardRef<HTMLDivElement, DataTableProps>(
  function DataTable<T = any>(
    props: DataTableProps<T>,
    ref: React.Ref<HTMLDivElement>
  ) {
    const {
      columns,
      data,
      visibleColumns,
      isAdjustable,
      isRowClickable,
      allowsSorting,
      search,
      stickyHeader,
      sortDescriptor: controlledSortDescriptor,
      onSortChange,
      // Selection props
      selectionMode = "none",
      selectionBehavior = "toggle",
      disallowEmptySelection,
      selectedKeys,
      defaultSelectedKeys,
      onSelectionChange,
      // Other props
      onRowClick,
      renderDetails,
      isTruncated,
      footer,
      nestedKey,
      ...rest
    } = props;

    // Internal sorting state (used when not controlled)
    const [internalSortDescriptor, setInternalSortDescriptor] = useState<
      SortDescriptor | undefined
    >();

    // Use controlled sort descriptor if provided, otherwise use internal state
    const sortDescriptor = controlledSortDescriptor ?? internalSortDescriptor;

    // Only show visible columns
    const visibleCols = useMemo(
      () =>
        columns.filter(
          (col) =>
            (visibleColumns ? visibleColumns.includes(col.id) : true) &&
            col.isVisible !== false
        ),
      [columns, visibleColumns]
    );

    // Filter rows by search
    const filteredRows = useMemo(
      () => (search ? filterRows(data, search, visibleCols, nestedKey) : data),
      [data, search, visibleCols, nestedKey]
    );

    // Sort the filtered rows
    const sortedRows = useMemo(
      () => sortRows(filteredRows, sortDescriptor, visibleCols, nestedKey),
      [filteredRows, sortDescriptor, visibleCols, nestedKey]
    );

    // Expanded rows state for nested rows
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const toggleExpand = (id: string) =>
      setExpanded((e) => ({ ...e, [id]: !e[id] }));

    // Manual selection state management
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
        
        // Check if we need to prevent empty selection
        if (disallowEmptySelection && currentSelection.size === 0) {
          return; // Don't allow deselecting if it would result in empty selection
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
        if (disallowEmptySelection) return; // Don't allow deselecting all if empty selection is disallowed
        onSelectionChange(new Set());
      }
    };

    // Highlight helper
    const highlightCell = (value: any) =>
      search && typeof value === "string" ? (
        <Highlight query={search} >
          {value}
        </Highlight>
      ) : (
        value
      );

    // Check if any row (or its nested content) is expandable
    function hasExpandableRows(rows: DataTableRowType<T>[], nestedKey?: string): boolean {
      if (!nestedKey) return false;
      return rows.some(
        (row) =>
          (row[nestedKey] && (
            Array.isArray(row[nestedKey]) ? row[nestedKey].length > 0 : true
          )) ||
          (Array.isArray(row[nestedKey]) && hasExpandableRows(row[nestedKey], nestedKey))
      );
    }
    const showExpandColumn = hasExpandableRows(sortedRows, nestedKey);

    // Show selection column when selection mode is not "none"
    const showSelectionColumn = selectionMode !== "none";

    // Render sort indicator
    const renderSortIndicator = (columnId: string) => {
      if (!allowsSorting) return null;
      
      const column = visibleCols.find((col) => col.id === columnId);
      if (column?.isSortable === false) return null;

      const isActive = sortDescriptor?.column === columnId;
      const direction = sortDescriptor?.direction;

      return (
        <span 
          style={{ 
            opacity: isActive ? 1 : 0.4,
            fontSize: '10px',
            transition: 'opacity 0.2s ease, color 0.2s ease',
            display: 'inline-flex',
            alignItems: 'center',
            width: '12px',
            height: '12px',
            justifyContent: 'center',
            color: isActive ? '#2563eb' : '#6b7280',
            fontWeight: 'bold'
          }}
        >
          {!isActive ? '⇅' : direction === 'ascending' ? '↑' : '↓'}
        </span>
      );
    };

    // Render a row (recursive for nested rows)
    const renderRow = (
      row: DataTableRowType<T>,
      depth = 0
    ): React.ReactNode => {
      const hasNestedContent = nestedKey && row[nestedKey] && (
        Array.isArray(row[nestedKey]) ? row[nestedKey].length > 0 : true
      );
      const isExpanded = expanded[row.id];
      
      const handleRowClick = () => {
        if (isRowClickable && onRowClick) {
          onRowClick(row);
        }
      };

      return (
        <>
          <AriaRow
            key={row.id}
            id={row.id}
            className="data-table-row"
            style={{
              cursor: isRowClickable ? "pointer" : undefined,
              // Add visual indication for nested rows
              ...(depth > 0 && {
                borderLeft: "2px solid blue",
                backgroundColor: "#f8fafc",
              }),
            }}
          >
            {/* Selection checkbox cell if selection is enabled */}
            {showSelectionColumn && (
              <AriaCell style={{ 
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <input
                  type="checkbox"
                  checked={isSelected(row.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleRowSelection(row.id, e.target.checked);
                  }}
                  style={{
                    width: 16,
                    height: 16,
                    cursor: 'pointer'
                  }}
                />
              </AriaCell>
            )}
            {/* Expand/collapse cell if expand column is shown */}
            {showExpandColumn && (
              <AriaCell style={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {hasNestedContent ? (
                  <DataTableExpandButton
                    aria-label={isExpanded ? "Collapse" : "Expand"}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(row.id);
                    }}
                  >
                    {isExpanded ? "-" : "+"}
                  </DataTableExpandButton>
                ) : null}
              </AriaCell>
            )}
            {visibleCols.map((col, index) => (
              <AriaCell key={col.id}>
                <div
                  onClick={isRowClickable ? handleRowClick : undefined}
                  className={isTruncated ? "truncated-cell" : ""}
                  style={{
                    width: "100%",
                    height: "100%",
                    cursor: isRowClickable ? "inherit" : undefined,
                    // Add indentation for the first column of nested rows
                    ...(depth > 0 && index === 0 && {
                      paddingLeft: `${16 + (depth * 16)}px`,
                    }),
                  }}
                >
                  {col.render
                    ? col.render({
                        value: highlightCell(col.accessor(row)),
                        row,
                        column: col,
                      })
                    : highlightCell(col.accessor(row))}
                </div>
              </AriaCell>
            ))}
          </AriaRow>
          {hasNestedContent &&
            isExpanded &&
            nestedKey &&
            (Array.isArray(row[nestedKey]) 
              ? row[nestedKey].map((child) => renderRow(child, depth + 1))
              : <AriaRow>
                  <AriaCell
                    colSpan={visibleCols.length + (showExpandColumn ? 1 : 0) + (showSelectionColumn ? 1 : 0)}
                    style={{
                      borderLeft: "2px solid blue",
                    }}
                  >
                    {row[nestedKey]}
                  </AriaCell>
                </AriaRow>
            )}
          {renderDetails && isExpanded && (
            <AriaRow>
              <AriaCell
                colSpan={visibleCols.length + (showExpandColumn ? 1 : 0) + (showSelectionColumn ? 1 : 0)}
              >
                {renderDetails(row)}
              </AriaCell>
            </AriaRow>
          )}
        </>
      );
    };

    const [isHeaderHovered, setIsHeaderHovered] = useState(false);

    // Convert our sort descriptor to react-aria format
    const ariaSortDescriptor = sortDescriptor
      ? {
          column: sortDescriptor.column,
          direction: sortDescriptor.direction,
        }
      : undefined;

    // Handle sort change from react-aria
    const handleSortChange = (descriptor: any) => {
      if (descriptor) {
        const newDescriptor = {
          column: descriptor.column,
          direction: descriptor.direction,
        };

        if (onSortChange) {
          onSortChange(newDescriptor);
        } else {
          setInternalSortDescriptor(newDescriptor);
        }
      }
    };

    return (
      <DataTableRoot 
        ref={ref as React.Ref<HTMLDivElement>}
        truncated={isTruncated}
        density={props.density}
      >
        <ResizableTableContainer>
          <Table
            ref={ref as React.Ref<HTMLTableElement>}
            {...rest}
            sortDescriptor={ariaSortDescriptor}
            onSortChange={handleSortChange}
            style={{
              width: "100%",
              tableLayout: "auto",
              border: "1px solid #E0E0E0",
              ...(rest.style || {}),
            }}
          >
            <AriaTableHeader
              style={{
                background: "#F7F7F7",
                borderBottom: "1px solid #E0E0E0",
                ...(stickyHeader && {
                  position: "sticky",
                  top: 0,
                  zIndex: 10,
                  boxShadow: stickyHeader
                    ? "0 2px 4px #E0E0E0"
                    : undefined,
                }),
              }}
              onHoverStart={() => setIsHeaderHovered(true)}
              onHoverEnd={() => setIsHeaderHovered(false)}
            >
              {/* Selection column header if selection is enabled */}
              {showSelectionColumn && (
                <AriaColumn
                  id="selection"
                  className="selection-column-header"
                  width={60}
                  minWidth={60}
                  maxWidth={60}
                  style={{ 
                    textAlign: "left",
                    padding: "16px",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'left'
                  }}
                  allowsSorting={false}
                >
                  {selectionMode === "multiple" && (
                    <input
                      type="checkbox"
                      checked={isAllSelected()}
                      ref={(el) => {
                        if (el) {
                          el.indeterminate = isIndeterminate();
                        }
                      }}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      style={{
                        width: 16,
                        height: 16,
                        cursor: 'pointer'
                      }}
                    />
                  )}
                </AriaColumn>
              )}
              {/* Expand/collapse column header if needed */}
              {showExpandColumn && (
                <AriaColumn
                  id="expand"
                  width={20}
                  minWidth={20}
                  maxWidth={20}
                  allowsSorting={false}
                />
              )}
              {visibleCols.map((col) => {
                const isSortable = allowsSorting && col.isSortable !== false;
                return (
                  <AriaColumn
                    allowsSorting={isSortable}
                    key={col.id}
                    id={col.id}
                    isRowHeader
                    {...(isAdjustable && col.isAdjustable !== false
                      ? { allowsResizing: true }
                      : {})}
                    width={col.width}
                    defaultWidth={col.defaultWidth}
                    minWidth={col.minWidth}
                    maxWidth={col.maxWidth}
                    style={{
                      textAlign: "left",
                      position: "relative",
                      padding: "16px",
                      borderRight: isHeaderHovered
                        ? "1px solid #E0E0E0"
                        : "none",
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
                      <span>{col.header}</span>
                      {renderSortIndicator(col.id)}
                    </div>
                    {isAdjustable && col.isAdjustable !== false && (
                      <ColumnResizer>
                        {({ isResizing }) => (
                          <div
                            style={{
                              width: 4,
                              height: "100%",
                              position: "absolute",
                              right: 0,
                              top: 0,
                              cursor: "col-resize",
                              background: isResizing
                                ? "#3182ce"
                                : "transparent",
                              transition: "background 0.2s",
                              zIndex: 2,
                            }}
                          />
                        )}
                      </ColumnResizer>
                    )}
                  </AriaColumn>
                );
              })}
            </AriaTableHeader>
            <AriaTableBody>
              {sortedRows.length === 0 ? (
                <AriaRow>
                  <AriaCell
                    colSpan={visibleCols.length + (showExpandColumn ? 1 : 0) + (showSelectionColumn ? 1 : 0)}
                  >
                    No data
                  </AriaCell>
                </AriaRow>
              ) : (
                sortedRows.map((row) => renderRow(row))
              )}
            </AriaTableBody>
          </Table>
          {footer && (
            <DataTableFooter>
              {footer}
            </DataTableFooter>
          )}
        </ResizableTableContainer>
      </DataTableRoot>
    );
  }
);
DataTable.displayName = "DataTable";