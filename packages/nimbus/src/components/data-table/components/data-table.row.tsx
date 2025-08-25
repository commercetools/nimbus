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
import { Box, Checkbox, Button, Flex, IconButton, Tooltip } from "@/components";
import { useCopyToClipboard } from "@/hooks";
import {
  KeyboardArrowDown,
  KeyboardArrowRight,
  PushPin,
} from "@commercetools/nimbus-icons";

export interface DataTableRowProps<T extends object = Record<string, unknown>> {
  row: DataTableRowType<T>;
  depth?: number;
}

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
 * Determines if a click event originated from a selection-related interactive element.
 * This helps distinguish between selection controls and other interactive elements.
 *
 * @param e - The DOM Event object from the click listener
 * @returns Element if a selection-related interactive element was found, null otherwise
 */
function getIsSelectionInteractiveElement(e: Event) {
  const clickedElement = e.target as Element;
  return clickedElement?.closest(
    '[slot="selection"], [data-slot="selection"], [role="checkbox"]'
  );
}

/**
 * Prevents event propagation when clicking on non-interactive elements or
 * interactive elements that are not selection-related.
 * This ensures that:
 * - Selection only happens when clicking on selection controls
 * - Other interactive elements (buttons, etc.) don't trigger selection
 * - Non-interactive areas don't trigger selection
 *
 * @param e - The DOM Event to potentially stop propagation on
 */
function stopPropagationToNonInteractiveElements(e: Event) {
  const isInteractiveElement = getIsTableRowChildElementInteractive(e);
  const isSelectionElement = getIsSelectionInteractiveElement(e);

  // Stop propagation if:
  // 1. It's not an interactive element at all, OR
  // 2. It's an interactive element but NOT a selection element
  if (!isInteractiveElement || (isInteractiveElement && !isSelectionElement)) {
    e.stopPropagation();
  }
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
    showPinColumn,
    isRowClickable,
    isTruncated,
    onRowClick,
    onRowAction,
    pinnedRows,
    togglePin,
    sortedRows,
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
   * COMPLEX ROW CLICK HANDLING - WHY THIS APPROACH IS NECESSARY
   *
   * React Aria Components has a fundamental limitation where row actions are disabled
   * when a row is selected, which breaks custom click handlers and navigation patterns
   * commonly expected in data tables. This implementation uses native DOM event listeners
   * to bypass React Aria's built-in limitations and provide the following critical features:
   *
   * 1. **Row Click Handler**: Allow users to click anywhere on a row and activate the onClick handler
   * 2. **Smart Event Filtering**: Prevent conflicts with interactive elements (checkboxes, buttons)
   * 3. **Selection Isolation**: Ensure row selection only happens via explicit selection controls
   * 4. **Disabled Row Handling**: Support custom actions even on disabled rows when needed
   * 5. **Text Selection Support**: Avoid triggering click handler when users are selecting text
   *
   * This approach maintains the accessibility benefits of React Aria while enabling the
   * expected UX patterns for modern data tables. Without this implementation, users would
   * lose the ability to invoke the rows' onClick handler once selection is enabled.
   *
   * @see https://github.com/adobe/react-spectrum/issues/7962 - React Aria limitation
   */

  /**
   * Ref to track single click timeout for distinguishing single vs double clicks.
   * This prevents row navigation on double-clicks when the user intends to select text.
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
   * Ref to track callback ref invocations and store the DOM node reference.
   *
   * React's callback refs can be called multiple times during a component's lifecycle
   * (on mount, re-renders, unmount), so we need to track invocation count to ensure:
   * - Event listeners are only attached once per row instance
   * - We maintain a reference to the DOM node for cleanup
   * - Memory leaks are prevented by avoiding duplicate listeners
   *
   * The counter pattern ensures we only attach listeners on the first callback
   * invocation when the DOM node is actually available.
   */
  const counterRef = useRef<{ count: number; node?: HTMLElement }>({
    count: 0,
    node: undefined,
  });

  /**
   * Callback ref that attaches event listeners to the row DOM element.
   *
   * This ref is critical for implementing custom row click behavior outside of
   * React Aria's event system. It performs several important tasks:
   *
   * 1. **Single Attachment**: Only attaches listeners on the first callback invocation
   * 2. **Event Capture**: Uses capture phase to handle events before child elements
   * 3. **Multiple Listeners**: Attaches pointerdown, mouseup, and dblclick listeners
   * 4. **Always Available**: Listeners are always attached to support dynamic onRowClick changes
   *
   * The pointerdown listener prevents unwanted selection behavior when clicking on non-interactive
   * areas by stopping event propogation before the event first reaches the first event listener (onPointerDown)
   * in react-aria'a onPress handler.
   * The mouseup listener invokes the row's onClick handler once any possible text selection has been completed.
   * The dblclick listener enables native browser text selection behavior on double-clicks.
   * Using capture phase ensures our handlers run before any child element handlers.
   *
   * Performance note: Always attaching listeners has negligible overhead (~few bytes per row)
   * but provides better support for dynamic row clickability and reduces re-renders.
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
          stopPropagationToNonInteractiveElements,
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
    return () => {
      // Clear any pending click timeout to prevent memory leaks and stale callbacks
      if (clickTimeoutRef.current) {
        window.clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = null;
      }

      if (counterRef.current.count >= 1 && counterRef.current.node) {
        counterRef.current.node.removeEventListener(
          "pointerdown",
          stopPropagationToNonInteractiveElements
        );
        counterRef.current.node.removeEventListener("mouseup", handleRowClick);
        counterRef.current.node.removeEventListener(
          "dblclick",
          handleRowDoubleClick
        );
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
  const isExpanded = expanded[row.id];
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
        isDisabled={isDisabled}
        columns={activeColumns}
        ref={rowRef}
        id={row.id}
        className={`data-table-row ${isDisabled ? "data-table-row-disabled" : ""} ${isPinned ? `data-table-row-pinned ${getPinnedRowClasses()}` : ""}`}
        style={{
          cursor: isDisabled
            ? "not-allowed"
            : onRowClick
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
              <Checkbox
                name="select-row"
                slot="selection"
                aria-label="select row"
              />
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
                <Box
                  className={isTruncated ? "truncated-cell" : ""}
                  display="inline-block"
                  h="100%"
                  minW="0"
                  maxW="100%"
                  position="relative"
                  overflow="hidden"
                  cursor={isDisabled ? "not-allowed" : "text"}
                  // style={
                  //   // TODO: I'm not clear on what this is supposed to do?

                  //     // Add indentation for the first column of nested rows
                  //     // ...(depth > 0 &&
                  //     //   index === 0 && {
                  //     //     paddingLeft: `${16 + depth * 16}px`,
                  //     //   }),
                  // }
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
        <DataTableCell data-slot="pin-row-cell" isDisabled={isDisabled}>
          <Tooltip.Root>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              w="100%"
              h="100%"
            >
              <IconButton
                key="pin-btn"
                size="2xs"
                variant="ghost"
                aria-label={isPinned ? "Unpin row" : "Pin row"}
                colorPalette="primary"
                className={`nimbus-table-cell-pin-button ${isPinned ? "nimbus-table-cell-pin-button-pinned" : ""}`}
                onPress={() => {
                  togglePin(row.id);
                }}
              >
                <PushPin />
              </IconButton>
              <Tooltip.Content placement="top">
                {isPinned ? "Unpin row" : "Pin row"}
              </Tooltip.Content>
            </Box>
          </Tooltip.Root>
        </DataTableCell>
      </RaRow>

      {showExpandColumn && (
        <RaRow style={{ display: isExpanded ? undefined : "none" }}>
          <DataTableCell
            isDisabled={isDisabled}
            colSpan={
              activeColumns.length +
              (showExpandColumn ? 1 : 0) +
              (showSelectionColumn ? 1 : 0) +
              (showDetailsColumn ? 1 : 0) +
              (showPinColumn ? 1 : 0) -
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
