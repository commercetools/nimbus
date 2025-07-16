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
      onRowClick,
      renderDetails,
      ...rest
    } = props;

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
    const showExpandColumn = hasExpandableRows(filteredRows);

    // Render a row (recursive for nested rows)
    const renderRow = (
      row: DataTableRowType<T>,
      depth = 0
    ): React.ReactNode => {
      const hasChildren = row.children && row.children.length > 0;
      const isExpanded = expanded[row.id];
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
                {col.render
                  ? col.render({
                      value: highlightCell(col.accessor(row)),
                      row,
                      column: col,
                    })
                  : highlightCell(col.accessor(row))}
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

    return (
      <DataTableRoot ref={ref as React.Ref<HTMLTableElement>}>
        <style>
          {`
            .data-table-row:hover {
              background-color: #F8F9FA !important;
              transition: background-color 0.15s ease;
            }
          `}
        </style>
        <ResizableTableContainer>
          <Table
            ref={ref as React.Ref<HTMLTableElement>}
            {...rest}
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
                  allowsSorting={allowsSorting}
                />
              )}
              {visibleCols.map((col) => (
                <AriaColumn
                  allowsSorting={allowsSorting}
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
                    borderRight: isHeaderHovered ? "1px solid #E0E0E0" : "none",
                  }}
                >
                  {col.header}
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
                            background: isResizing ? "#3182ce" : "transparent",
                            transition: "background 0.2s",
                            zIndex: 2,
                          }}
                        />
                      )}
                    </ColumnResizer>
                  )}
                </AriaColumn>
              ))}
            </AriaTableHeader>
            <AriaTableBody>
              {filteredRows.length === 0 ? (
                <AriaRow style={rowBorderStyle}>
                  <AriaCell
                    colSpan={visibleCols.length}
                    style={{ padding: cellPadding }}
                  >
                    No data
                  </AriaCell>
                </AriaRow>
              ) : (
                filteredRows.map((row) => renderRow(row))
              )}
            </AriaTableBody>
          </Table>
        </ResizableTableContainer>
      </DataTableRoot>
    );
  }
);
DataTable.displayName = "DataTable";
