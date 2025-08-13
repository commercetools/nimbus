import { forwardRef } from "react";
import {
  Row as RaRow,
  Collection as RaCollection,
  useTableOptions,
} from "react-aria-components";
import { Highlight } from "@chakra-ui/react";
import { useDataTableContext } from "./data-table.context";
import { DataTableCell } from "./data-table.cell";
import { DataTableExpandButton } from "../data-table.slots";
import type {
  DataTableRowItem as DataTableRowType,
  DataTableColumnItem,
} from "../data-table.types";
import { Box, Checkbox, Button, Flex, IconButton } from "@/components";
import { useCopyToClipboard } from "@/hooks";
import {
  KeyboardArrowDown,
  KeyboardArrowRight,
  ContentCopy,
} from "@commercetools/nimbus-icons";

export interface DataTableRowProps<T extends object = Record<string, unknown>> {
  row: DataTableRowType<T>;
  depth?: number;
}

export const DataTableRow = forwardRef(function DataTableRow<
  T extends object = Record<string, unknown>,
>(
  { row, depth = 0 }: DataTableRowProps<T>,
  ref: React.Ref<HTMLTableRowElement>
) {
  const {
    activeColumns,
    search,
    expanded,
    toggleExpand,
    nestedKey,
    disabledKeys,
    showExpandColumn,
    showSelectionColumn,
    showDetailsColumn,
    isRowClickable,
    isTruncated,
    onRowClick,
    onDetailsClick,
    onRowAction,
  } = useDataTableContext<T>();

  const { selectionBehavior } = useTableOptions();

  const [, copyToClipboard] = useCopyToClipboard();

  // Helper function to check if row is disabled
  const getIsDisabled = (rowId: string) => {
    if (!disabledKeys) return false;
    if (disabledKeys === "all") return true;
    if (row.isDisabled) return true;
    return disabledKeys.has(rowId);
  };

  const isDisabled = getIsDisabled(row.id);

  const hasNestedContent =
    nestedKey &&
    row[nestedKey] &&
    (Array.isArray(row[nestedKey]) ? row[nestedKey].length > 0 : true);
  const isExpanded = expanded[row.id];

  const handleRowClick = () => {
    if (isDisabled) {
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
  const handleCopy = (value: unknown) => {
    const textValue = typeof value === "string" ? value : String(value);
    copyToClipboard(textValue);
  };

  // Highlight helper
  const highlightCell = (value: unknown): React.ReactNode =>
    search && typeof value === "string" ? (
      <Highlight query={search} ignoreCase={true} matchAll={true}>
        {value}
      </Highlight>
    ) : (
      (value as React.ReactNode)
    );
  // TODO: does the row need a slot for styling?
  return (
    <>
      <RaRow
        onAction={!isDisabled && isRowClickable ? handleRowClick : () => {}}
        isDisabled={isDisabled}
        columns={activeColumns}
        ref={ref}
        id={row.id}
        className={`data-table-row ${isDisabled ? "data-table-row-disabled" : ""}`}
        style={{
          cursor: isDisabled
            ? "not-allowed"
            : isRowClickable
              ? "pointer"
              : undefined,
          position: "relative",
          ...(depth > 0 && {
            borderLeft: "2px solid var(--colors-primary-6)",
            backgroundColor: "var(--colors-slate-2)",
          }),
        }}
        dependencies={[isExpanded, search, isTruncated]}
      >
        {/** Internal/non-data columns like selection and expand
         * need to be in the same order in the header and row components*/}
        {/* Selection checkbox cell if selection is enabled */}
        {selectionBehavior === "toggle" && (
          <DataTableCell
            isDisabled={isDisabled}
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              w="100%"
              h="100%"
            >
              <Checkbox name="select-row" slot="selection" />
            </Box>
          </DataTableCell>
        )}

        {/* Expand/collapse cell if expand column is shown */}
        {showExpandColumn && (
          <DataTableCell isDisabled={isDisabled}>
            {hasNestedContent ? (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                w="100%"
                h="100%"
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
          </DataTableCell>
        )}
        {/* Data cells */}
        <RaCollection items={activeColumns}>
          {(col: DataTableColumnItem<T>) => {
            const cellValue = col.accessor(row);
            const isDetailsCell = col.id === "nimbus-data-table-details-column";

            if (isDetailsCell) {
              return (
                <DataTableCell
                  key="details-column"
                  isDisabled={isDisabled}
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    w="100%"
                    h="100%"
                  >
                    <Button
                      aria-label="View row details"
                      className="data-table-row-details-button"
                      disabled={isDisabled}
                      variant="outline"
                      colorPalette="primary"
                      size="2xs"
                      onPress={() => {
                        if (onDetailsClick) {
                          onDetailsClick(row);
                        }
                      }}
                    >
                      Open
                    </Button>
                  </Box>
                </DataTableCell>
              );
            }
            return (
              <DataTableCell isDisabled={isDisabled} key={col.id}>
                <Flex>
                  <Box
                    className={isTruncated ? "truncated-cell" : ""}
                    h="100%"
                    minW="0"
                    position="relative"
                    cursor={
                      isDisabled
                        ? "not-allowed"
                        : isRowClickable
                          ? "inherit"
                          : undefined
                    }
                    style={
                      // TODO: I'm not clear on what this is supposed to do?
                      {
                        // Add indentation for the first column of nested rows
                        // ...(depth > 0 &&
                        //   index === 0 && {
                        //     paddingLeft: `${16 + depth * 16}px`,
                        //   }),
                      }
                    }
                  >
                    {col.render
                      ? col.render({
                          value: highlightCell(cellValue),
                          row,
                          column: col,
                        })
                      : highlightCell(cellValue)}
                  </Box>

                  {/* Cell hover buttons */}

                  <IconButton
                    key="copy-btn"
                    size="2xs"
                    variant="ghost"
                    aria-label="Copy to clipboard"
                    colorPalette="primary"
                    className="nimbus-table-cell-copy-button"
                    onPress={() => handleCopy(cellValue)}
                    ml="100"
                  >
                    <ContentCopy
                      key="copy-icon"
                      onClick={() => handleCopy(cellValue)}
                    />
                  </IconButton>
                </Flex>
              </DataTableCell>
            );
          }}
        </RaCollection>
      </RaRow>

      {showExpandColumn && (
        <RaRow style={{ display: isExpanded ? undefined : "none" }}>
          <DataTableCell
            isDisabled={isDisabled}
            colSpan={
              activeColumns.length +
              (showExpandColumn ? 1 : 0) +
              (showSelectionColumn ? 1 : 0) +
              (showDetailsColumn ? 1 : 0) -
              // length is 1 indexed, but arrays/sets are 0 indexed, so we need to subtract 1 from the total
              1
            }
            style={{
              borderLeft: "2px solid blue",
            }}
          >
            {nestedKey && Array.isArray(row[nestedKey])
              ? `${(row[nestedKey] as unknown[]).length} nested items`
              : nestedKey && (row[nestedKey] as React.ReactNode)}
          </DataTableCell>
        </RaRow>
      )}
    </>
  );
});

DataTableRow.displayName = "DataTable.Row";
