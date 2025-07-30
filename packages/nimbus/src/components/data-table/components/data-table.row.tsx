import { forwardRef } from "react";
import { Row as RaRow, Cell as RaCell } from "react-aria-components";
import { Highlight } from "@chakra-ui/react";
import { useDataTableContext } from "./data-table.root";
import { DataTableExpandButton } from "../data-table.slots";
import type { DataTableRow as DataTableRowType } from "../data-table.types";
import { Box, Checkbox } from "@/components";
import {
  KeyboardArrowDown,
  KeyboardArrowRight,
} from "@commercetools/nimbus-icons";

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
      isDisabled,
      onRowAction,
    } = useDataTableContext();

    const hasNestedContent =
      nestedKey &&
      row[nestedKey] &&
      (Array.isArray(row[nestedKey]) ? row[nestedKey].length > 0 : true);
    const isExpanded = expanded[row.id];

    const handleRowClick = () => {
      if (isDisabled(row.id)) {
        if (onRowAction) {
          onRowAction(row, "click");
        }
        return;
      }

      if (isRowClickable && onRowClick) {
        onRowClick(row);
      }
    };

    // Highlight helper
    const highlightCell = (value: any) =>
      search && typeof value === "string" ? (
        <Highlight query={search}>{value}</Highlight>
      ) : (
        value
      );

    return (
      <>
        <RaRow
          onAction={
            !isDisabled(row.id) && isRowClickable ? handleRowClick : undefined
          }
          ref={ref}
          id={row.id}
          className={`data-table-row ${isSelected(row.id) ? "data-table-row-selected" : ""} ${isDisabled(row.id) ? "data-table-row-disabled" : ""}`}
          style={{
            cursor: isDisabled(row.id)
              ? "not-allowed"
              : isRowClickable
                ? "pointer"
                : undefined,
            ...(!isSelected(row.id) &&
              depth > 0 && {
                borderLeft: "2px solid var(--colors-primary-6)",
                backgroundColor: "var(--colors-slate-2)",
              }),
          }}
        >
          {/* Selection checkbox cell if selection is enabled */}
          {showSelectionColumn && (
            <RaCell
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                onClick={(e) => e.stopPropagation()} // Prevent row click when clicking checkbox area
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Checkbox
                  name="select-row"
                  isSelected={isSelected(row.id)}
                  isDisabled={isDisabled(row.id)}
                  aria-label="Select row"
                  onChange={(isSelected) => {
                    handleRowSelection(row.id, Boolean(isSelected));
                  }}
                />
              </Box>
            </RaCell>
          )}

          {/* Expand/collapse cell if expand column is shown */}
          {showExpandColumn && (
            <RaCell>
              {hasNestedContent ? (
                <Box
                  onClick={(e) => e.stopPropagation()} // Prevent row click when clicking expand button area
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <DataTableExpandButton
                    aria-label={isExpanded ? "Collapse" : "Expand"}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(row.id);
                    }}
                  >
                    {isExpanded ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
                  </DataTableExpandButton>
                </Box>
              ) : null}
            </RaCell>
          )}

          {/* Data cells */}
          {visibleCols.map((col, index) => (
            <RaCell key={col.id}>
              <Box
                className={isTruncated ? "truncated-cell" : ""}
                style={{
                  width: "100%",
                  height: "100%",
                  cursor: isDisabled(row.id)
                    ? "not-allowed"
                    : isRowClickable
                      ? "inherit"
                      : undefined,
                  // Add indentation for the first column of nested rows
                  ...(depth > 0 &&
                    index === 0 && {
                      paddingLeft: `${16 + depth * 16}px`,
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
              </Box>
            </RaCell>
          ))}
        </RaRow>

        {hasNestedContent && isExpanded && nestedKey && (
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
                : row[nestedKey]}
            </RaCell>
          </RaRow>
        )}
      </>
    );
  }
);

DataTableRow.displayName = "DataTable.Row";
