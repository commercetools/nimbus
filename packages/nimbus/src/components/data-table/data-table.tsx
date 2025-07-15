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
      search,
      onRowClick,
      onDetailsClick,
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

    // Header background style
    const headerBgStyle = { background: "#F7F7F7" };

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
            // onClick removed, not supported by AriaRow
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
                  ? col.render({ value: highlightCell(col.accessor(row)), row, column: col })
                  : highlightCell(col.accessor(row))}
              </AriaCell>
            ))}
            {onDetailsClick && (
              <AriaCell style={{ padding: cellPadding }}>
                <DataTableDetailsButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onDetailsClick(row);
                  }}
                >
                  More details
                </DataTableDetailsButton>
              </AriaCell>
            )}
          </AriaRow>
          {hasChildren &&
            isExpanded &&
            row.children!.map((child) => renderRow(child, depth + 1))}
          {renderDetails && isExpanded && (
            <AriaRow style={rowBorderStyle}>
              <AriaCell
                colSpan={
                  visibleCols.length +
                  (onDetailsClick ? 1 : 0) +
                  (showExpandColumn ? 1 : 0)
                }
                style={{ padding: cellPadding }}
              >
                {renderDetails(row)}
              </AriaCell>
            </AriaRow>
          )}
        </>
      );
    };

    return (
      <DataTableRoot
        ref={ref}
        {...rest}
        style={{
          boxShadow: "0 0 0 1px var(--global-color-border, #E0E0E0)",
          borderRadius: "2px",
          ...(rest.style || {}),
        }}
      >
        <Table style={{ width: "100%", tableLayout: "auto" }}>
          <AriaTableHeader style={{ ...headerBgStyle }}>
            {/* Expand/collapse column header if needed */}
            {showExpandColumn && (
              <AriaColumn id="expand" style={{ width: 32 }} />
            )}
            {visibleCols.map((col) => (
              <AriaColumn
                key={col.id}
                id={col.id}
                {...(isAdjustable && col.isAdjustable !== false
                  ? { allowsResizing: true }
                  : {})}
                style={{ padding: cellPadding, textAlign: "left" }}
              >
                {col.header}
              </AriaColumn>
            ))}
            {onDetailsClick && (
              <AriaColumn
                id="details"
                style={{
                  padding: cellPadding,
                  textAlign: "left",
                  ...headerBgStyle,
                }}
              />
            )}
          </AriaTableHeader>
          <AriaTableBody>
            {filteredRows.length === 0 ? (
              <AriaRow style={rowBorderStyle}>
                <AriaCell
                  colSpan={visibleCols.length + (onDetailsClick ? 1 : 0)}
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
      </DataTableRoot>
    );
  }
);
DataTable.displayName = "DataTable";
