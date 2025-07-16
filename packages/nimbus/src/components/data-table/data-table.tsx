import { forwardRef, useMemo, useState } from "react";
import {
  DataTableRoot,
  DataTableTable,
  DataTableHeader,
  DataTableBody,
  DataTableRow,
  DataTableCell,
  DataTableColumnHeader,
  DataTableColumnResizer,
  DataTableDetailsButton,
  DataTableExpandButton,
  DataTableNestedIcon,
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
  columns: DataTableColumn<T>[]
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
      let children = row.children
        ? filterRows(row.children, search, columns)
        : undefined;
      if (match || (children && children.length > 0)) {
        return { ...row, children };
      }
      return null;
    })
    .filter(Boolean) as DataTableRowType<T>[];
}

function sortRows<T>(
  rows: DataTableRowType<T>[],
  sortDescriptor: SortDescriptor | undefined,
  columns: DataTableColumn<T>[]
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

  // Recursively sort children
  return sortedRows.map((row) => ({
    ...row,
    children: row.children
      ? sortRows(row.children, sortDescriptor, columns)
      : undefined,
  }));
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
      onRowClick,
      renderDetails,
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
      () => (search ? filterRows(data, search, visibleCols) : data),
      [data, search, visibleCols]
    );

    // Sort the filtered rows
    const sortedRows = useMemo(
      () => sortRows(filteredRows, sortDescriptor, visibleCols),
      [filteredRows, sortDescriptor, visibleCols]
    );

    // Expanded rows state for nested rows
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const toggleExpand = (id: string) =>
      setExpanded((e) => ({ ...e, [id]: !e[id] }));

    // Highlight helper
    const highlightCell = (value: any) =>
      search && typeof value === "string" ? (
        <Highlight query={search} styles={{ bg: "yellow.200" }}>
          {value}
        </Highlight>
      ) : (
        value
      );

    // Padding values for density
    const cellPadding = props.density === "condensed" ? "8px" : "16px";

    // Row border style
    const rowBorderStyle = { borderBottom: "1px solid #E0E0E0" };

    // Check if any row (or its children) is expandable
    function hasExpandableRows(rows: DataTableRowType<T>[]): boolean {
      return rows.some(
        (row) =>
          (row.children && row.children.length > 0) ||
          (row.children && hasExpandableRows(row.children))
      );
    }
    const showExpandColumn = hasExpandableRows(sortedRows);

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
      const hasChildren = row.children && row.children.length > 0;
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
            className="data-table-row"
            style={{
              cursor: isRowClickable ? "pointer" : undefined,
              ...rowBorderStyle,
            }}
          >
            {/* Expand/collapse cell if expand column is shown */}
            {showExpandColumn && (
              <AriaCell style={{ padding: cellPadding, width: 32 }}>
                {hasChildren ? (
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
            {visibleCols.map((col) => (
              <AriaCell key={col.id} style={{ padding: cellPadding }}>
                <div
                  onClick={isRowClickable ? handleRowClick : undefined}
                  style={{
                    width: "100%",
                    height: "100%",
                    cursor: isRowClickable ? "inherit" : undefined,
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
          {hasChildren &&
            isExpanded &&
            row.children!.map((child) => renderRow(child, depth + 1))}
          {renderDetails && isExpanded && (
            <AriaRow style={rowBorderStyle}>
              <AriaCell
                colSpan={visibleCols.length + (showExpandColumn ? 1 : 0)}
                style={{ padding: cellPadding }}
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
      <DataTableRoot ref={ref as React.Ref<HTMLTableElement>}>
        <style>
          {`
            .data-table-row:hover {
              background-color: #F8F9FA !important;
              transition: background-color 0.15s ease;
            }
            .react-aria-Column {
              cursor: pointer;
              user-select: none;
              transition: background-color 0.15s ease;
            }
            .react-aria-Column:hover {
              background-color: #E8E8E8 !important;
            }
            .react-aria-Column[aria-sort] {
              font-weight: 600;
            }
            .react-aria-Column[aria-sort="none"]:hover {
              background-color: #F0F0F0 !important;
            }
            .react-aria-Column[aria-sort="ascending"],
            .react-aria-Column[aria-sort="descending"] {
              background-color: #F0F8FF !important;
            }
            .react-aria-Column[aria-sort="ascending"]:hover,
            .react-aria-Column[aria-sort="descending"]:hover {
              background-color: #E6F3FF !important;
            }
          `}
        </style>
        <ResizableTableContainer>
          <Table
            ref={ref as React.Ref<HTMLTableElement>}
            {...rest}
            sortDescriptor={ariaSortDescriptor}
            onSortChange={handleSortChange}
            style={{
              width: "100%",
              tableLayout: "auto",
              boxShadow: "0 0 0 1px var(--global-color-border, #E0E0E0)",
              borderRadius: "2px",
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
                    ? "0 2px 4px rgba(0,0,0,0.1)"
                    : undefined,
                }),
              }}
              onHoverStart={() => setIsHeaderHovered(true)}
              onHoverEnd={() => setIsHeaderHovered(false)}
            >
              {/* Expand/collapse column header if needed */}
              {showExpandColumn && (
                <AriaColumn
                  id="expand"
                  style={{ width: 32 }}
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
                    {...(isAdjustable && col.isAdjustable !== false
                      ? { allowsResizing: true }
                      : {})}
                    width={col.width}
                    defaultWidth={col.defaultWidth}
                    minWidth={col.minWidth}
                    maxWidth={col.maxWidth}
                    style={{
                      padding: cellPadding,
                      textAlign: "left",
                      position: "relative",
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
                <AriaRow style={rowBorderStyle}>
                  <AriaCell
                    colSpan={visibleCols.length + (showExpandColumn ? 1 : 0)}
                    style={{ padding: cellPadding }}
                  >
                    No data
                  </AriaCell>
                </AriaRow>
              ) : (
                sortedRows.map((row) => renderRow(row))
              )}
            </AriaTableBody>
          </Table>
        </ResizableTableContainer>
      </DataTableRoot>
    );
  }
);
DataTable.displayName = "DataTable";
