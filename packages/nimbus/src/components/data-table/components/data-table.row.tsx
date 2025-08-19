import { forwardRef, useRef, useCallback, useEffect } from "react";
import {
  Row as RaRow,
  Collection as RaCollection,
  useTableOptions,
} from "react-aria-components";
import { mergeRefs } from "@chakra-ui/react";
import { Highlight } from "@chakra-ui/react/highlight";
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

  // Helper function to check if row is disabled
  const getIsDisabled = (rowId: string) => {
    if (!disabledKeys) return false;
    if (disabledKeys === "all") return true;
    if (row.isDisabled) return true;
    return disabledKeys.has(rowId);
  };
  const isDisabled = getIsDisabled(row.id);

  /**
   * Custom row click handling implementation to work around React Aria limitations.
   *
   * React Aria Components disable row actions when a row is selected, which prevents
   * custom click handlers from working properly. This implementation uses native DOM
   * event listeners to bypass this limitation and provide consistent row click behavior.
   *
   * @see https://github.com/adobe/react-spectrum/issues/7962
   */

  /**
   * Handles row click events with smart filtering to avoid conflicts with interactive elements.
   * Uses native DOM Event type to be compatible with addEventListener.
   *
   * @param e - Native DOM Event from the click listener
   */
  const handleRowClick = (e: Event) => {
    // Cast target to Element since EventTarget doesn't have closest method
    const clickedElement = e.target as Element;
    // Prevent row click when clicking on interactive elements to avoid conflicts
    const isInteractiveElement = clickedElement?.closest(
      'button, input, [role="button"], [role="checkbox"], [slot="selection"], [data-slot="selection"]'
    );

    if (!isInteractiveElement && isRowClickable && onRowClick) {
      if (!isDisabled) {
        onRowClick(row);
      } else {
        // Handle disabled row clicks differently - allows for special disabled row actions
        // TODO: Clarify business requirement - why allow clicks on disabled rows?
        if (onRowAction) {
          onRowAction(row, "click");
        }
      }
    }
  };

  /**
   * Ref to track the callback ref invocation count and store the DOM node reference.
   * This prevents duplicate event listeners and enables proper cleanup.
   */
  const counterRef = useRef<{ count: number; node?: HTMLElement }>({
    count: 0,
    node: undefined,
  });

  /**
   * Callback ref that attaches the click event listener to the row DOM element.
   * Only attaches the listener once per row instance to prevent memory leaks.
   *
   * @param node - The HTMLElement reference from React's ref callback
   */
  const rowNodeRef = useCallback(
    (node: HTMLElement) => {
      counterRef.current.count += 1;

      // Only attach event listener on first callback invocation when row is clickable
      if (counterRef.current.count === 1 && node && isRowClickable) {
        counterRef.current.node = node;
        // Use capture phase to ensure we handle the event before child elements
        node.addEventListener("click", handleRowClick, { capture: true });
      }
    },
    [isRowClickable, handleRowClick]
  );

  /**
   * Cleanup effect to remove event listeners when the component unmounts.
   * This prevents memory leaks when rows are removed from the DOM (e.g., filtering, pagination).
   */
  useEffect(() => {
    return () => {
      if (counterRef.current.count >= 1 && counterRef.current.node) {
        counterRef.current.node.removeEventListener("click", handleRowClick);
      }
    };
  }, [handleRowClick]);

  // Combine the forwarded ref with our callback ref for proper DOM access
  const rowRef = mergeRefs(ref, rowNodeRef);

  const { selectionBehavior } = useTableOptions();

  const [, copyToClipboard] = useCopyToClipboard();

  const hasNestedContent =
    nestedKey &&
    row[nestedKey] &&
    (Array.isArray(row[nestedKey]) ? row[nestedKey].length > 0 : true);
  const isExpanded = expanded[row.id];

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
        // onAction={!isDisabled && isRowClickable ? handleRowClick : () => {}}
        isDisabled={isDisabled}
        columns={activeColumns}
        ref={rowRef}
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
          <DataTableCell data-slot="selection" isDisabled={isDisabled}>
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
          <DataTableCell data-slot="expand" isDisabled={isDisabled}>
            {hasNestedContent ? (
              <DataTableExpandButton
                w="100%"
                h="100%"
                cursor="pointer"
                aria-label={isExpanded ? "Collapse" : "Expand"}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(row.id);
                }}
              >
                {isExpanded ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
              </DataTableExpandButton>
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
                    display="inline-block"
                    h="100%"
                    minW="0"
                    maxW="100%"
                    position="relative"
                    overflow="hidden"
                    cursor={isDisabled ? "not-allowed" : "text"}
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
            {isExpanded
              ? nestedKey && Array.isArray(row[nestedKey])
                ? `${(row[nestedKey] as unknown[]).length} nested items`
                : nestedKey && (row[nestedKey] as React.ReactNode)
              : null}
          </DataTableCell>
        </RaRow>
      )}
    </>
  );
});

DataTableRow.displayName = "DataTable.Row";
