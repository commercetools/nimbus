import { useRef, useCallback, useEffect } from "react";
import {
  Row as RaRow,
  Collection as RaCollection,
  useTableOptions,
} from "react-aria-components";
import { mergeRefs } from "@chakra-ui/react";
import { Highlight } from "@chakra-ui/react/highlight";
import { useDataTableContext } from "./data-table.context";
import { DataTableCell } from "./data-table.cell";
import { DataTableRowSlot } from "../data-table.slots";
import type {
  DataTableRowItem,
  DataTableColumnItem,
  DataTableRowProps,
} from "../data-table.types";
import { Box, Checkbox, IconButton, Tooltip } from "@/components";
import {
  KeyboardArrowDown,
  KeyboardArrowRight,
  PushPin,
} from "@commercetools/nimbus-icons";
import { extractStyleProps } from "@/utils";
import { useLocalizedStringFormatter } from "@/hooks";
import { dataTableMessagesStrings } from "../data-table.messages";

/**
 * DataTable.Row - Individual row component that renders data cells and handles row-level interactions
 *
 * @supportsStyleProps
 */

/**
 * Determines if a click event originated from an interactive element within a table row.
 * This is crucial for preventing row click handlers from interfering with intended
 * interactions like checkbox selection, button clicks, or other form controls.
 *
 * @param e - The DOM Event object from the click listener
 * @returns Element if an interactive element was found, null otherwise
 */
function getIsTableRowChildElementInteractive(e: Event) {
  // Cast target to Element since EventTarget doesn't have closest method
  const clickedElement = e.target as Element;
  return clickedElement?.closest(
    'button, input, [role="button"], [role="checkbox"], [slot="selection"], [data-slot="selection"]'
  );
}

/**
 * Prevents pointerdown propagation for non-interactive areas of a table row.
 *
 * This stops React Aria's row-level press handling from triggering selection
 * when clicking on empty row areas. Interactive elements (buttons, checkboxes)
 * are left alone so their own press handlers (usePress/onPress) can work.
 *
 * @param e - The DOM Event to potentially stop propagation on
 */
function stopPropagationForNonInteractiveElements(e: Event) {
  const isInteractiveElement = getIsTableRowChildElementInteractive(e);

  if (!isInteractiveElement) {
    e.stopPropagation();
  }
}
export const DataTableRow = <T extends DataTableRowItem = DataTableRowItem>({
  row,
  ref,
  ...props
}: DataTableRowProps<T>) => {
  const msg = useLocalizedStringFormatter(dataTableMessagesStrings);
  const {
    activeColumns,
    search,
    expanded,
    toggleExpand,
    nestedKey,
    disabledKeys,
    showExpandColumn,
    showSelectionColumn,
    isTruncated,
    onRowClick,
    onRowAction,
    pinnedRows,
    togglePin,
    sortedRows,
  } = useDataTableContext<T>();

  const [styleProps, restProps] = extractStyleProps(props);

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
  const clickTimeoutRef = useRef<number | null>(null);

  /**
   * Handles row click events with sophisticated filtering to ensure proper UX behavior.
   *
   * This function implements multiple layers of click validation:
   * - Prevents interference with interactive elements (buttons, checkboxes, inputs)
   * - Respects text selection (users shouldn't trigger onClick handler when copying text)
   * - Handles both enabled and disabled row states appropriately
   * - Only triggers onClick handler when the row is explicitly marked as clickable
   * - Uses a delay mechanism to distinguish single clicks from double clicks
   *
   * Uses native DOM Event type to maintain compatibility with addEventListener and
   * ensure consistent behavior across different browsers and interaction methods.
   *
   * @param e - Native DOM Event from the click listener
   */
  const handleRowClick = useCallback(
    (e: Event) => {
      // Don't do anything if onRowClick is undefined
      if (!onRowClick) return;
      // Prevent row click when clicking on interactive elements to avoid conflicts
      const isInteractiveElement = getIsTableRowChildElementInteractive(e);
      // Prevent row click when text is selected
      const hasSelectedText =
        window.getSelection()?.toString() !== undefined &&
        window.getSelection()!.toString().length > 0;

      if (!isInteractiveElement && !hasSelectedText) {
        // Clear any existing timeout to handle rapid clicks
        if (clickTimeoutRef.current) {
          window.clearTimeout(clickTimeoutRef.current);
        }

        // Delay the row click to allow for potential double-click cancellation
        // Standard double-click timeout is typically 300-500ms
        clickTimeoutRef.current = window.setTimeout(() => {
          if (!isDisabled) {
            onRowClick(row);
          } else {
            // Handle disabled row clicks differently - allows for special disabled row actions
            // TODO: Clarify business requirement - why allow clicks on disabled rows?
            if (onRowAction) {
              onRowAction(row, "click");
            }
          }
          clickTimeoutRef.current = null;
        }, 300);
      }
    },
    [onRowClick, onRowAction, row, isDisabled]
  );

  /**
   * Handles double-click events to enable default browser text selection behavior.
   *
   * When users double-click on text within a table row, they expect the browser's
   * default word selection behavior. This handler:
   * - Cancels any pending single-click row navigation
   * - Allows the browser's native word selection to work normally
   * - Only applies to non-interactive elements (preserves button/input behavior)
   *
   * @param e - Native DOM Event from the dblclick listener
   */
  const handleRowDoubleClick = useCallback((e: Event) => {
    const isInteractiveElement = getIsTableRowChildElementInteractive(e);

    if (!isInteractiveElement) {
      // Cancel any pending single-click action
      if (clickTimeoutRef.current) {
        window.clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = null;
      }
      // Allow browser's default text selection behavior
      // No need to prevent default or stop propagation - let the browser handle it
    }
  }, []); // No dependencies needed - this function doesn't use any external variables

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
      // Only attach event listener on first callback invocation
      if (counterRef.current.count === 1 && node) {
        counterRef.current.node = node;
        // Ensures that selection does not happen on row click, only when the selection cell is clicked
        node.addEventListener(
          // Use pointerdown event in order to capture event before it bubbles to react-aria's onPress handler
          "pointerdown",
          stopPropagationForNonInteractiveElements,
          {
            capture: true,
          }
        );

        // Use mouseup event to ensure that if the user is selecting text, the entire selection is set in window.selection
        node.addEventListener("mouseup", handleRowClick, { capture: true });

        // Use dblclick event to enable native browser text selection behavior
        node.addEventListener("dblclick", handleRowDoubleClick, {
          capture: true,
        });
      }
    },
    [handleRowClick, handleRowDoubleClick]
  );

  /**
   * Cleanup effect to remove event listeners when the component unmounts.
   *
   * This is crucial for preventing memory leaks in dynamic table scenarios where:
   * - Rows are filtered in/out of view
   * - Pagination changes remove rows from the DOM
   * - Table data is refreshed or updated
   * - Component is unmounted during navigation
   *
   * Without proper cleanup, event listeners would remain attached to orphaned
   * DOM nodes, leading to memory leaks and potential crashes in long-running applications.
   * The cleanup runs in the effect's return function, ensuring it executes
   * before the component is fully removed from the React tree.
   */
  useEffect(() => {
    const counter = counterRef.current;
    return () => {
      // Clear any pending click timeout to prevent memory leaks and stale callbacks
      if (clickTimeoutRef.current) {
        window.clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = null;
      }

      if (counter.count >= 1 && counter.node) {
        counter.node.removeEventListener(
          "pointerdown",
          stopPropagationForNonInteractiveElements
        );
        counter.node.removeEventListener("mouseup", handleRowClick);
        counter.node.removeEventListener("dblclick", handleRowDoubleClick);
      }
    };
  }, [handleRowClick, handleRowDoubleClick]);

  // Combine the forwarded ref with our callback ref for proper DOM access
  // This allows parent components to access the row element while maintaining our event listeners
  const rowRef = mergeRefs(ref, rowNodeRef);

  const { selectionBehavior } = useTableOptions();

  const hasNestedContent =
    nestedKey &&
    row[nestedKey] &&
    (Array.isArray(row[nestedKey]) ? row[nestedKey].length > 0 : true);
  const isExpanded = expanded.has(row.id);
  const isPinned = pinnedRows.has(row.id);

  // Calculate pinned row position for styling
  const pinnedRowIds = sortedRows
    .filter((r) => pinnedRows.has(r.id))
    .map((r) => r.id);
  const pinnedRowIndex = isPinned ? pinnedRowIds.indexOf(row.id) : -1;
  const isFirstPinned = pinnedRowIndex === 0;
  const isLastPinned = pinnedRowIndex === pinnedRowIds.length - 1;
  const isSinglePinned = pinnedRowIds.length === 1 && isPinned;

  // Generate pinned row CSS classes
  const getPinnedRowClasses = () => {
    if (!isPinned) return "";
    if (isSinglePinned) return "data-table-row-pinned-single";
    if (isFirstPinned) return "data-table-row-pinned-first";
    if (isLastPinned) return "data-table-row-pinned-last";
    return "";
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
      <DataTableRowSlot asChild {...styleProps}>
        <RaRow
          isDisabled={isDisabled}
          columns={activeColumns}
          ref={rowRef}
          id={row.id}
          className={`data-table-row ${isDisabled ? "data-table-row-disabled" : ""} ${isPinned ? `data-table-row-pinned ${getPinnedRowClasses()}` : ""}`}
          {...restProps}
          dependencies={[isExpanded, search, isTruncated]}
        >
          {/** Internal/non-data columns like selection and expand
           * need to be in the same order in the header and row components*/}
          {/* Selection checkbox cell if selection is enabled */}
          {selectionBehavior === "toggle" && (
            <DataTableCell
              className="data-table-sticky-cell"
              data-slot="selection"
              isDisabled={isDisabled}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                w="100%"
                h="100%"
              >
                <Checkbox
                  name="select-row"
                  slot="selection"
                  aria-label={msg.format("selectRow")}
                />
              </Box>
            </DataTableCell>
          )}

          {/* Expand/collapse cell if expand column is shown */}
          {showExpandColumn && (
            <DataTableCell
              className="data-table-sticky-cell"
              data-slot="expand"
              isDisabled={isDisabled}
            >
              {hasNestedContent ? (
                // TODO:Button does not occupy the whole height
                <IconButton
                  w="100%"
                  h="100%"
                  unstyled
                  borderRadius="0"
                  aria-label={isExpanded ? "Collapse" : "Expand"}
                  onPress={() => toggleExpand(row.id)}
                >
                  {isExpanded ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
                </IconButton>
              ) : null}
            </DataTableCell>
          )}
          {/* Data cells */}
          <RaCollection items={activeColumns}>
            {(col: DataTableColumnItem<T>) => {
              const cellValue = col.accessor(row);

              return (
                <DataTableCell isDisabled={isDisabled} key={col.id}>
                  <Box
                    className={isTruncated ? "truncated-cell" : ""}
                    data-truncated={isTruncated ? "true" : "false"}
                    display="inline-block"
                    h="100%"
                    minW="0"
                    maxW="100%"
                    position="relative"
                    overflow="hidden"
                    cursor={isDisabled ? "not-allowed" : "text"}
                  >
                    {col.render
                      ? col.render({
                          value: highlightCell(cellValue),
                          row,
                          column: col,
                        })
                      : highlightCell(cellValue)}
                  </Box>
                </DataTableCell>
              );
            }}
          </RaCollection>
          <DataTableCell
            className={"data-table-sticky-cell"}
            data-slot="pin-row-cell"
            isDisabled={isDisabled}
          >
            <Box
              data-slot={
                isPinned
                  ? "nimbus-table-cell-pin-button-pinned"
                  : "nimbus-table-cell-pin-button"
              }
            >
              <Tooltip.Root>
                <IconButton
                  key="pin-btn"
                  size="2xs"
                  variant="ghost"
                  aria-label={isPinned ? "Unpin row" : "Pin row"}
                  colorPalette="primary"
                  onPress={() => togglePin(row.id)}
                >
                  <PushPin />
                </IconButton>
                <Tooltip.Content placement="top">
                  {isPinned ? "Unpin row" : "Pin row"}
                </Tooltip.Content>
              </Tooltip.Root>
            </Box>
          </DataTableCell>
        </RaRow>
      </DataTableRowSlot>

      {showExpandColumn && (
        <DataTableRowSlot {...styleProps} asChild>
          <RaRow
            data-nested-row-expanded={isExpanded ? "true" : "false"}
            dependencies={[isExpanded]}
          >
            <DataTableCell
              isDisabled={isDisabled}
              colSpan={
                activeColumns.length +
                (showExpandColumn ? 1 : 0) +
                (showSelectionColumn ? 1 : 0) +
                1
              }
              data-nested-cell
            >
              {isExpanded
                ? nestedKey && Array.isArray(row[nestedKey])
                  ? `${(row[nestedKey] as unknown[]).length} nested items`
                  : nestedKey && (row[nestedKey] as React.ReactNode)
                : null}
            </DataTableCell>
          </RaRow>
        </DataTableRowSlot>
      )}
    </>
  );
};

DataTableRow.displayName = "DataTable.Row";
