import { forwardRef, useState } from "react";
import { Row as RaRow, Cell as RaCell } from "react-aria-components";
import { Highlight } from "@chakra-ui/react";
import { useDataTableContext } from "./data-table.root";
import { DataTableExpandButton } from "../data-table.slots";
import type { DataTableRow as DataTableRowType } from "../data-table.types";
import { Box, Checkbox, IconButton } from "@/components";
import { useCopyToClipboard } from "@/hooks";
import {
  KeyboardArrowDown,
  KeyboardArrowRight,
  ContentCopy,
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

    // Hover state management - only for copy functionality
    const [hoveredCell, setHoveredCell] = useState<string | null>(null);
    const [, copyToClipboard] = useCopyToClipboard();

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

    // Action handlers - only copy functionality
    const handleCopy = (value: any) => {
      const textValue = typeof value === "string" ? value : String(value);
      copyToClipboard(textValue);
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
            position: "relative",
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
                    {isExpanded ? (
                      <KeyboardArrowDown />
                    ) : (
                      <KeyboardArrowRight />
                    )}
                  </DataTableExpandButton>
                </Box>
              ) : null}
            </RaCell>
          )}

          {/* Data cells */}
          {visibleCols.map((col, index) => {
            const cellId = `${row.id}-${col.id}`;
            const cellValue = col.accessor(row);
            const isCurrentCellHovered = hoveredCell === cellId;

            return (
              <RaCell key={col.id}>
                <Box
                  className={isTruncated ? "truncated-cell" : ""}
                  onMouseEnter={() => setHoveredCell(cellId)}
                  onMouseLeave={() => setHoveredCell(null)}
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
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
                        value: highlightCell(cellValue),
                        row,
                        column: col,
                      })
                    : highlightCell(cellValue)}

                  {/* Cell hover buttons */}
                  {isCurrentCellHovered && !isDisabled(row.id) && (
                    <IconButton
                      key="copy-btn"
                      size="2xs"
                      variant="ghost"
                      aria-label="Copy to clipboard"
                      colorPalette="primary"
                      onPress={() => handleCopy(cellValue)}
                      style={{
                        marginLeft: "4px",
                      }}
                    >
                      <ContentCopy
                        key="copy-icon"
                        onClick={() => handleCopy(cellValue)}
                      />
                    </IconButton>
                  )}
                </Box>
              </RaCell>
            );
          })}
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
              {nestedKey && Array.isArray(row[nestedKey])
                ? `${row[nestedKey].length} nested items`
                : nestedKey && row[nestedKey]}
            </RaCell>
          </RaRow>
        )}
      </>
    );
  }
);

DataTableRow.displayName = "DataTable.Row";
