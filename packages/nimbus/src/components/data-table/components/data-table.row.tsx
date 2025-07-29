import { forwardRef } from "react";
import { Row as RaRow, Cell as RaCell } from "react-aria-components";
import { Highlight } from "@chakra-ui/react";
import { useDataTableContext } from "./data-table.root";
import { DataTableExpandButton } from "../data-table.slots";
import type { DataTableRow as DataTableRowType } from "../data-table.types";

export interface DataTableRowProps {
  row: DataTableRowType<any>;
  depth?: number;
}

export const DataTableRow = forwardRef<HTMLTableRowElement, DataTableRowProps>(
  function DataTableRow({ row, depth = 0 }, ref) {
    const {
      visibleCols,
      search,
      expanded,
      toggleExpand,
      nestedKey,
      showExpandColumn,
      showSelectionColumn,
      isRowClickable,
      isTruncated,
      onRowClick,
      isSelected,
      handleRowSelection,
    } = useDataTableContext();

    const hasNestedContent = nestedKey && row[nestedKey] && (
      Array.isArray(row[nestedKey]) ? row[nestedKey].length > 0 : true
    );
    const isExpanded = expanded[row.id];

    const handleRowClick = () => {
      if (isRowClickable && onRowClick) {
        onRowClick(row);
      }
    };

    // Highlight helper
    const highlightCell = (value: any) =>
      search && typeof value === "string" ? (
        <Highlight query={search}>
          {value}
        </Highlight>
      ) : (
        value
      );

    return (
      <>
        <RaRow
          ref={ref}
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
            <RaCell
              style={{
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <input
                type="checkbox"
                checked={isSelected(row.id)}
                aria-label="Select row"
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
            </RaCell>
          )}

          {/* Expand/collapse cell if expand column is shown */}
          {showExpandColumn && (
            <RaCell
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
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
            </RaCell>
          )}

          {/* Data cells */}
          {visibleCols.map((col, index) => (
            <RaCell key={col.id}>
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
            </RaCell>
          ))}
        </RaRow>

        {/* TODO: Implement nested content rows - will need to avoid recursive issues */}
        {hasNestedContent &&
          isExpanded &&
          nestedKey && (
            <RaRow>
              <RaCell
                colSpan={
                  visibleCols.length +
                  (showExpandColumn ? 1 : 0) +
                  (showSelectionColumn ? 1 : 0)
                }
                style={{
                  borderLeft: "2px solid blue",
                }}
              >
                {Array.isArray(row[nestedKey]) 
                  ? `${row[nestedKey].length} nested items` 
                  : row[nestedKey]
                }
              </RaCell>
            </RaRow>
          )}
      </>
    );
  }
);

DataTableRow.displayName = "DataTable.Row"; 