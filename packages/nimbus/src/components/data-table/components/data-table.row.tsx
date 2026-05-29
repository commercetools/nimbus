import { useRef, useCallback, useEffect, memo } from "react";
import {
  Row as RaRow,
  Collection as RaCollection,
  Cell as RaCell,
  useTableOptions,
} from "react-aria-components";
import { mergeRefs } from "@/utils";
import { Highlight } from "@chakra-ui/react/highlight";
import { useStableDataTableContext } from "./data-table.context";
import { DataTableCell } from "./data-table.cell";
import { DataTableRowSlot } from "../data-table.slots";
import type {
  DataTableRowItem,
  DataTableColumnItem,
  DataTableRowProps,
} from "../data-table.types";
import { Box, Checkbox, IconButton } from "@/components";
import { IconToggleButton } from "@/components/icon-toggle-button/icon-toggle-button";
import {
  DragIndicator,
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
    'button, input, [role="button"], [role="checkbox"], [slot="selection"], [data-slot="selection"], [slot="drag"], [data-slot="drag"]'
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

type DataTableRowPerRowProps = {
  isExpanded: boolean;
  isPinned: boolean;
  isFirstPinned: boolean;
  isLastPinned: boolean;
  isSinglePinned: boolean;
};

const DataTableRowInner = <T extends DataTableRowItem = DataTableRowItem>({
  row,
  ref,
  isExpanded,
  isPinned,
  isFirstPinned,
  isLastPinned,
  isSinglePinned,
  ...props
}: DataTableRowProps<T> & DataTableRowPerRowProps) => {
  const {
    activeColumns,
    search,
    toggleExpand,
    nestedKey,
    disabledKeys,
    showExpandColumn,
    showSelectionColumn,
    isTruncated,
    onRowClick,
    onRowAction,
    togglePin,
    selectRowLabel,
  } = useStableDataTableContext<T>();

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
      if (!isInteractiveElement) {
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

      // draggable="true" suppresses native text selection, so
      // programmatically select the word under the cursor.
      // Only needed when the row is actually draggable.
      const target = e.target as HTMLElement;
      const row = target?.closest?.("[draggable='true']");
      if (row && e instanceof MouseEvent) {
        const selection = window.getSelection();
        if (!selection) return;

        // Firefox / Chrome
        if (typeof document.caretPositionFromPoint === "function") {
          const caretPos = document.caretPositionFromPoint(
            e.clientX,
            e.clientY
          );
          if (caretPos?.offsetNode) {
            const sel = selection as Selection & {
              modify(
                alter: string,
                direction: string,
                granularity: string
              ): void;
            };
            sel.removeAllRanges();
            sel.collapse(caretPos.offsetNode, caretPos.offset);
            sel.modify("move", "backward", "word");
            sel.extend(caretPos.offsetNode, caretPos.offset);
            sel.modify("extend", "forward", "word");
          }
        } else if (
          typeof (document as unknown as Record<string, unknown>)
            .caretRangeFromPoint === "function"
        ) {
          // Safari fallback
          const range = (
            document as unknown as {
              caretRangeFromPoint(x: number, y: number): Range | null;
            }
          ).caretRangeFromPoint(e.clientX, e.clientY);
          if (range) {
            const sel = selection as Selection & {
              modify(
                alter: string,
                direction: string,
                granularity: string
              ): void;
            };
            sel.removeAllRanges();
            sel.addRange(range);
            sel.modify("move", "backward", "word");
            sel.modify("extend", "forward", "word");
          }
        }
      }
    }
  }, []);

  // --- Row click handler wiring ---
  //
  // Native DOM listeners are used instead of React events because React Aria's
  // row-level press handling conflicts with custom click behavior (e.g. it
  // disables row actions when selection is enabled). Three capture-phase
  // listeners on the row element handle this:
  //
  //   pointerdown (capture) — stops propagation for non-interactive targets,
  //     preventing React Aria from triggering selection on empty row areas.
  //
  //   mouseup (capture) — fires handleRowClick with a 300ms delay so that a
  //     subsequent dblclick can cancel it before it triggers navigation.
  //
  //   dblclick (capture) — cancels the pending single-click and, when the row
  //     is draggable, programmatically selects the word under the cursor
  //     (draggable="true" suppresses native text selection).
  //
  // Stable-identity wrappers delegate through refs so the listeners never need
  // to be removed and reattached when handler deps change — only the ref value
  // is updated each render.

  const handleRowClickRef = useRef(handleRowClick);
  handleRowClickRef.current = handleRowClick;
  const handleRowDoubleClickRef = useRef(handleRowDoubleClick);
  handleRowDoubleClickRef.current = handleRowDoubleClick;

  const stableRowClick = useCallback(
    (e: Event) => handleRowClickRef.current(e),
    []
  );
  const stableRowDblClick = useCallback(
    (e: Event) => handleRowDoubleClickRef.current(e),
    []
  );

  const rowNodeRef = useRef<HTMLElement | null>(null);

  // Callback ref: attach listeners when the DOM node appears, detach when it
  // changes or is removed. Runs during commit phase (before effects).
  const rowCallbackRef = useCallback((node: HTMLElement | null) => {
    const prev = rowNodeRef.current;
    if (prev === node) return;

    if (prev) {
      prev.removeEventListener(
        "pointerdown",
        stopPropagationForNonInteractiveElements,
        { capture: true }
      );
      prev.removeEventListener("mouseup", stableRowClick, { capture: true });
      prev.removeEventListener("dblclick", stableRowDblClick, {
        capture: true,
      });
    }

    rowNodeRef.current = node;

    if (node) {
      node.addEventListener(
        "pointerdown",
        stopPropagationForNonInteractiveElements,
        { capture: true }
      );
      node.addEventListener("mouseup", stableRowClick, { capture: true });
      node.addEventListener("dblclick", stableRowDblClick, { capture: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Unmount cleanup: the callback ref handles node swaps, but React does not
  // call it with null on unmount when the ref identity is stable. This effect
  // ensures listeners are removed when the row leaves the tree.
  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        window.clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = null;
      }
      const node = rowNodeRef.current;
      if (node) {
        node.removeEventListener(
          "pointerdown",
          stopPropagationForNonInteractiveElements,
          { capture: true }
        );
        node.removeEventListener("mouseup", stableRowClick, {
          capture: true,
        });
        node.removeEventListener("dblclick", stableRowDblClick, {
          capture: true,
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rowRef = mergeRefs(ref, rowCallbackRef);

  const { selectionBehavior, allowsDragging } = useTableOptions();
  const msg = useLocalizedStringFormatter(dataTableMessagesStrings);

  const hasNestedContent =
    nestedKey &&
    row[nestedKey] &&
    (Array.isArray(row[nestedKey]) ? row[nestedKey].length > 0 : true);

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
          data-clickable={!!onRowClick && !isDisabled}
          className={`data-table-row ${isDisabled ? "data-table-row-disabled" : ""} ${isPinned ? `data-table-row-pinned ${getPinnedRowClasses()}` : ""}`}
          {...restProps}
          dependencies={[isExpanded, search, isTruncated]}
        >
          {/** Internal/non-data columns like drag, selection, and expand
           * need to be in the same order in the header and row components*/}
          {allowsDragging && (
            <RaCell className="data-table-sticky-cell" data-slot="drag">
              <IconButton
                slot="drag"
                data-drag-handle=""
                size="2xs"
                variant="ghost"
                colorPalette="neutral"
                aria-label={msg.format("dragRow")}
              >
                <DragIndicator />
              </IconButton>
            </RaCell>
          )}
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
                  aria-label={selectRowLabel}
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
                  cursor="pointer"
                  focusVisibleRing="inside"
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
                    minW="0"
                    maxW="100%"
                    position="relative"
                    overflow="hidden"
                    cursor={isDisabled ? "not-allowed" : undefined}
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
              title={isPinned ? "Unpin row" : "Pin row"}
            >
              <IconToggleButton
                key="pin-btn"
                size="2xs"
                variant="ghost"
                aria-label={isPinned ? "Unpin row" : "Pin row"}
                colorPalette="primary"
                isSelected={isPinned}
                onChange={() => togglePin(row.id)}
              >
                <PushPin />
              </IconToggleButton>
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
                (allowsDragging ? 1 : 0) +
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

export const DataTableRow = memo(
  DataTableRowInner
) as typeof DataTableRowInner & {
  displayName?: string;
};

DataTableRow.displayName = "DataTable.Row";
