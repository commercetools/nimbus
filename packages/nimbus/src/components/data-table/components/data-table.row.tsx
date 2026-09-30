import { useRef, useCallback, useContext, useEffect, memo } from "react";
import {
  Row as RaRow,
  Collection as RaCollection,
  Cell as RaCell,
  TableStateContext,
  useTableOptions,
} from "react-aria-components";
import { isFocusable } from "@react-aria/utils";
import { mergeRefs } from "@/utils";
import { Highlight } from "@chakra-ui/react/highlight";
import { useDataTableRowContext } from "./data-table.context";
import { DataTableCell } from "./data-table.cell";
import { DataTableRowSlot } from "../data-table.slots";
import type {
  DataTableRowItem,
  DataTableColumnItem,
  DataTableRowProps,
  DataTableRowRenderProps,
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
 * Finds the control from a fixed list (buttons, inputs, checkboxes, the
 * selection and drag handles) that an event came from.
 *
 * @param e - The DOM Event object from a listener on the row element
 * @returns The listed element if one was found, null otherwise
 */
function getListedInteractiveElement(e: Event) {
  // Cast target to Element since EventTarget doesn't have closest method
  return (e.target as Element)?.closest(
    'button, input, [role="button"], [role="checkbox"], [slot="selection"], [data-slot="selection"], [slot="drag"], [data-slot="drag"]'
  );
}

/**
 * Determines if a click event originated from an interactive element within a table row.
 * This is crucial for preventing row click handlers from interfering with intended
 * interactions like checkbox selection, button clicks, links, or other form controls.
 *
 * Besides the elements in `getListedInteractiveElement`, anything that can
 * take focus inside a cell (a link, a text field, a custom widget with
 * `tabindex`) counts, and so
 * does a label, which passes its click on to a form control such as a
 * checkbox. The row and its cells can take focus too, so that search stops
 * below the cell.
 *
 * @param e - The DOM Event object from a listener on the row element
 * @returns Element if an interactive element was found, null otherwise
 */
function getIsTableRowChildElementInteractive(e: Event) {
  // Cast target to Element since EventTarget doesn't have closest method
  const clickedElement = e.target as Element;
  const listedElement = getListedInteractiveElement(e);
  if (listedElement) return listedElement;

  const rowElement = e.currentTarget as Element | null;
  for (
    let element: Element | null = clickedElement;
    element && element !== rowElement && element.parentElement !== rowElement;
    element = element.parentElement
  ) {
    if (
      element.tagName === "LABEL" ||
      isFocusable(element, { skipVisibilityCheck: true })
    ) {
      return element;
    }
  }
  return null;
}

/**
 * Prevents pointerdown propagation for non-interactive areas of a table row.
 *
 * This stops React Aria's row-level press handling from triggering selection
 * when clicking on empty row areas. Interactive elements (buttons, checkboxes)
 * are left alone so their own press handlers (usePress/onPress) can work.
 *
 * Besides the fixed list, only elements that handle presses themselves count
 * here: React Aria's `usePress` marks them with `data-react-aria-pressable`.
 * The label of a Nimbus Checkbox is one; it cancels the native label click
 * and toggles the checkbox from its own press. The wider check that click
 * and Enter activation use does not fit: React Aria selects the row when a
 * press starts, unless the target can be reached with Tab, so a plain label,
 * an element inside a link or an element with `tabindex="-1"` would select
 * the row if it got through. The row and its cells use `usePress` too, so
 * the search stops below the cell.
 *
 * @param e - The DOM Event to potentially stop propagation on
 */
function stopPropagationForNonInteractiveElements(e: Event) {
  let isInteractiveElement = !!getListedInteractiveElement(e);

  const rowElement = e.currentTarget as Element | null;
  for (
    let element: Element | null = e.target as Element;
    !isInteractiveElement &&
    element &&
    element !== rowElement &&
    element.parentElement !== rowElement;
    element = element.parentElement
  ) {
    isInteractiveElement = element.hasAttribute("data-react-aria-pressable");
  }

  if (!isInteractiveElement) {
    e.stopPropagation();
  }
}

/**
 * Renders a row's nested content and owns its `close` callback.
 *
 * Closing from inside removes the element that has focus, and React Aria
 * would then move focus to whichever row now sits in that position. `close`
 * first points React Aria's focus at the control that opened the panel (the
 * expand cell, or the row when there is no expand column), so focus returns
 * there instead. The nested row comes from a ref, not from its DOM id: two
 * tables on one page can use the same row ids.
 *
 * This is a component of its own because React Aria renders
 * `DataTable.Row` itself outside the table's state context; cell content is
 * rendered inside it, so `TableStateContext` is only available here.
 */
const NestedContentPanel = ({
  rowKey,
  nestedRowRef,
  openerCellIndex,
  onClose,
  children,
}: {
  rowKey: string;
  nestedRowRef: React.RefObject<HTMLElement | null>;
  openerCellIndex?: number;
  onClose: () => void;
  children: (close: () => void) => React.ReactNode;
}) => {
  const tableState = useContext(TableStateContext);
  const close = useCallback(() => {
    const nestedRow = nestedRowRef.current;
    if (tableState && nestedRow?.contains(document.activeElement)) {
      const cells = [...(tableState.collection.getChildren?.(rowKey) ?? [])];
      const openerKey =
        openerCellIndex === undefined ? rowKey : cells[openerCellIndex]?.key;
      tableState.selectionManager.setFocusedKey(openerKey ?? rowKey);
    }
    onClose();
  }, [tableState, nestedRowRef, rowKey, openerCellIndex, onClose]);

  return <>{children(close)}</>;
};

type DataTableRowPerRowProps = Partial<DataTableRowRenderProps>;

const DataTableRowInner = <T extends DataTableRowItem = DataTableRowItem>({
  row,
  ref,
  children,
  className: consumerClassName,
  isExpanded = false,
  isPinned = false,
  isFirstPinned = false,
  isLastPinned = false,
  isSinglePinned = false,
  ...props
}: DataTableRowProps<T> & DataTableRowPerRowProps) => {
  const {
    activeColumns,
    search,
    toggleExpand,
    nestedKey,
    disabledKeys,
    showExpandColumn,
    hasExpandableContent,
    showSelectionColumn,
    showPinColumn,
    isTruncated,
    isRowClickable,
    hasRenderNestedContent,
    onRowClickRef,
    onRowActionRef,
    renderNestedContent,
    togglePin,
    selectRowLabel,
    getRowKey,
  } = useDataTableRowContext<T>();

  const [styleProps, restProps] = extractStyleProps(props);

  // The row's identity comes from the row data, never from the rendered
  // element. DataTable.Body computes `isExpanded` / `isPinned` and `sortRows`
  // partitions pinned rows before any element exists, so they can only ever
  // see `getRowKey(row)`. Reading the key back from an element `id` would make
  // this row toggle state under a name the rest of the table never checks.
  const rowKey = getRowKey(row);

  // A custom `DataTable.Body` renderer may still put a different `id` on the
  // row. React Aria then keys selection by that id while expansion, pinning
  // and `disabledKeys` keep using `row.id` — one row, two identities. That is
  // unsupported; say so in development instead of failing quietly.
  // `restProps` is a broad Omit<> of every DOM attribute, so narrow to the one
  // field we care about rather than widening the whole type.
  const suppliedId = (restProps as { id?: string | number }).id;
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (suppliedId == null || String(suppliedId) === rowKey) return;
    console.warn(
      `DataTable: row "${rowKey}" was rendered with a different id, ` +
        `"${suppliedId}". Selection would use "${suppliedId}" while ` +
        `expansion, pinning and disabledKeys use "${rowKey}". To choose a ` +
        "row's identity, set `id` in the row data instead."
    );
  }, [suppliedId, rowKey]);
  const hasCustomBg = !!(
    styleProps.bg ||
    styleProps.bgColor ||
    styleProps.backgroundColor ||
    styleProps.background
  );

  // Helper function to check if row is disabled
  const getIsDisabled = (rowId: string) => {
    if (row.isDisabled) return true;
    if (!disabledKeys) return false;
    if (disabledKeys === "all") return true;
    return disabledKeys.has(rowId);
  };
  const isDisabled = getIsDisabled(rowKey);

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

  // Set by the pointerdown capture listener below when it fires on this
  // row's own DOM node. Read (and reset) by handleRowClick's mouseup
  // listener to reject a retargeted mouseup that never had a matching
  // pointerdown on this row.
  const pressStartedOnRowRef = useRef(false);

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
  const hasNestedContent =
    nestedKey &&
    row[nestedKey] &&
    (Array.isArray(row[nestedKey]) ? row[nestedKey].length > 0 : true);

  // Without an expand column, activating a row expands it, but only a row
  // that has something to expand. A row without children is not clickable
  // for this reason, so Enter still reaches React Aria and selects it.
  const expandViaRowClick =
    hasExpandableContent &&
    !showExpandColumn &&
    !!(hasNestedContent || hasRenderNestedContent);

  const isClickable = isRowClickable || expandViaRowClick;

  /**
   * Activates the row: expands it when there is no expand column, then calls
   * `onRowAction` (or the deprecated `onRowClick`). Shared by the mouse path,
   * which calls it after the double-click delay, and the Enter key, which
   * calls it immediately.
   *
   * @param columnId - Column of the cell that triggered the activation
   */
  const activateRow = useCallback(
    (columnId?: string) => {
      if (isDisabled) return;
      if (expandViaRowClick) toggleExpand(rowKey, columnId);
      (onRowActionRef.current ?? onRowClickRef.current)?.(row);
    },
    [
      isDisabled,
      expandViaRowClick,
      toggleExpand,
      rowKey,
      onRowActionRef,
      onRowClickRef,
      row,
    ]
  );

  const handleRowClick = useCallback(
    (e: Event) => {
      // Reject a mouseup that has no matching pointerdown on this row.
      // A pointerdown that starts on an element that unmounts mid-gesture
      // (e.g. a popover option closing on selection) makes the browser
      // retarget the trailing pointerup/mouseup/click to whatever is now
      // underneath the pointer - which can be this row. Requiring both
      // halves of the press to have touched the row rejects that spurious
      // mouseup without affecting any real click, drag, or checkbox press.
      const pressStartedHere = pressStartedOnRowRef.current;
      pressStartedOnRowRef.current = false;
      if (!pressStartedHere) return;

      if (!isClickable || isDisabled) return;
      const isInteractiveElement = getIsTableRowChildElementInteractive(e);
      if (!isInteractiveElement) {
        const hasSelectedText =
          (window.getSelection()?.toString().trim().length ?? 0) > 0;
        if (hasSelectedText) return;

        if (clickTimeoutRef.current) {
          window.clearTimeout(clickTimeoutRef.current);
        }

        const clickedCell = (e.target as Element)?.closest("[data-column-id]");
        const columnId =
          clickedCell?.getAttribute("data-column-id") ?? undefined;

        // Wait so that a double-click (selecting a word to copy it) can
        // cancel the activation in handleRowDoubleClick.
        clickTimeoutRef.current = window.setTimeout(() => {
          activateRow(columnId);
          clickTimeoutRef.current = null;
        }, 300);
      }
    },
    [isClickable, isDisabled, activateRow]
  );

  /**
   * Activates the row on Enter, the keyboard equivalent of a click (WCAG
   * 2.1.1). Space is left to React Aria, which uses it for selection.
   *
   * Runs in the capture phase and stops the event, so React Aria does not
   * also toggle selection on Enter. A capture listener sees every keydown
   * inside the row, so it only acts when the row itself or one of its cells
   * has focus. Enter on anything focused inside a cell (a link, a button, a
   * checkbox) is left to that element.
   *
   * @param e - Native DOM Event from the keydown listener
   */
  const handleRowKeyDown = useCallback(
    (e: Event) => {
      if (!(e instanceof KeyboardEvent)) return;
      if (e.key !== "Enter" || e.repeat || e.isComposing) return;
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (!isClickable || isDisabled) return;
      const rowElement = e.currentTarget as Element;
      const target = e.target as Element;
      if (target !== rowElement && target.parentElement !== rowElement) return;

      e.preventDefault();
      e.stopPropagation();
      const focusedCell = (e.target as Element)?.closest("[data-column-id]");
      activateRow(focusedCell?.getAttribute("data-column-id") ?? undefined);
    },
    [isClickable, isDisabled, activateRow]
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
      const row = target?.closest?.("[draggable='true']") as HTMLElement | null;
      if (row && e instanceof MouseEvent) {
        const selection = window.getSelection();
        if (!selection) return;

        // Chrome applies user-select:none on draggable rows which causes
        // caretPositionFromPoint to skip those elements entirely (returning
        // a caret in a different row) and prevents the selection highlight
        // from rendering. Temporarily allow text selection so the caret
        // APIs resolve the correct text node and Chrome shows the highlight.
        const prevUserSelect = row.style.userSelect;
        row.style.userSelect = "text";

        const resetUserSelect = () => {
          row.style.userSelect = prevUserSelect;
        };
        document.addEventListener("pointerdown", resetUserSelect, {
          capture: true,
          once: true,
        });

        type SelectionWithModify = Selection & {
          modify(alter: string, direction: string, granularity: string): void;
        };

        if (typeof document.caretPositionFromPoint === "function") {
          const caretPos = document.caretPositionFromPoint(
            e.clientX,
            e.clientY
          );
          if (caretPos?.offsetNode) {
            const sel = selection as SelectionWithModify;
            sel.removeAllRanges();
            sel.collapse(caretPos.offsetNode, caretPos.offset);
            sel.modify("move", "backward", "word");
            sel.modify("extend", "forward", "word");
          }
        } else if (
          typeof (document as unknown as Record<string, unknown>)
            .caretRangeFromPoint === "function"
        ) {
          const range = (
            document as unknown as {
              caretRangeFromPoint(x: number, y: number): Range | null;
            }
          ).caretRangeFromPoint(e.clientX, e.clientY);
          if (range) {
            const sel = selection as SelectionWithModify;
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
  // disables row actions when selection is enabled). Four capture-phase
  // listeners on the row element handle this:
  //
  //   pointerdown (capture) — stops propagation for non-interactive targets,
  //     preventing React Aria from triggering selection on empty row areas,
  //     and records that a press started on this row (see
  //     pressStartedOnRowRef) so a later retargeted mouseup can be rejected.
  //
  //   mouseup (capture) — fires handleRowClick with a 300ms delay so that a
  //     subsequent dblclick can cancel it before it triggers navigation.
  //
  //   dblclick (capture) — cancels the pending single-click and, when the row
  //     is draggable, programmatically selects the word under the cursor
  //     (draggable="true" suppresses native text selection).
  //
  //   keydown (capture) — activates the row on Enter, immediately, before
  //     React Aria can treat Enter as selection. React Aria's Row does not
  //     forward keyboard props to the DOM, so this is a native listener too.
  //
  // Stable-identity wrappers delegate through refs so the listeners never need
  // to be removed and reattached when handler deps change — only the ref value
  // is updated each render.

  const handleRowClickRef = useRef(handleRowClick);
  handleRowClickRef.current = handleRowClick;
  const handleRowDoubleClickRef = useRef(handleRowDoubleClick);
  handleRowDoubleClickRef.current = handleRowDoubleClick;
  const handleRowKeyDownRef = useRef(handleRowKeyDown);
  handleRowKeyDownRef.current = handleRowKeyDown;

  const stableRowClick = useCallback(
    (e: Event) => handleRowClickRef.current(e),
    []
  );
  const stableRowDblClick = useCallback(
    (e: Event) => handleRowDoubleClickRef.current(e),
    []
  );
  const stableRowKeyDown = useCallback(
    (e: Event) => handleRowKeyDownRef.current(e),
    []
  );
  const stablePointerDownCapture = useCallback((e: Event) => {
    pressStartedOnRowRef.current = true;
    stopPropagationForNonInteractiveElements(e);
  }, []);

  const rowNodeRef = useRef<HTMLElement | null>(null);

  // Callback ref: attach listeners when the DOM node appears, detach when it
  // changes or is removed. Runs during commit phase (before effects).
  const rowCallbackRef = useCallback((node: HTMLElement | null) => {
    const prev = rowNodeRef.current;
    if (prev === node) return;

    if (prev) {
      prev.removeEventListener("pointerdown", stablePointerDownCapture, {
        capture: true,
      });
      prev.removeEventListener("mouseup", stableRowClick, { capture: true });
      prev.removeEventListener("dblclick", stableRowDblClick, {
        capture: true,
      });
      prev.removeEventListener("keydown", stableRowKeyDown, { capture: true });
    }

    rowNodeRef.current = node;

    if (node) {
      node.addEventListener("pointerdown", stablePointerDownCapture, {
        capture: true,
      });
      node.addEventListener("mouseup", stableRowClick, { capture: true });
      node.addEventListener("dblclick", stableRowDblClick, { capture: true });
      node.addEventListener("keydown", stableRowKeyDown, { capture: true });
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
        node.removeEventListener("pointerdown", stablePointerDownCapture, {
          capture: true,
        });
        node.removeEventListener("mouseup", stableRowClick, {
          capture: true,
        });
        node.removeEventListener("dblclick", stableRowDblClick, {
          capture: true,
        });
        node.removeEventListener("keydown", stableRowKeyDown, {
          capture: true,
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nestedContentId = `nested-content-${rowKey}`;
  const ariaNodeRef = useRef<HTMLElement | null>(null);
  const ariaRef = useCallback((node: HTMLElement | null) => {
    ariaNodeRef.current = node;
  }, []);

  useEffect(() => {
    const node = ariaNodeRef.current;
    if (!node) return;
    if (hasRenderNestedContent && isExpanded) {
      node.setAttribute("aria-controls", nestedContentId);
    } else {
      node.removeAttribute("aria-controls");
    }
  }, [hasRenderNestedContent, isExpanded, nestedContentId]);

  const rowRef = mergeRefs(ref, rowCallbackRef, ariaRef);

  const { allowsDragging } = useTableOptions();
  const msg = useLocalizedStringFormatter(dataTableMessagesStrings);
  const pinLabel = msg.format(isPinned ? "unpinRow" : "pinRow");

  const nestedRowNodeRef = useRef<HTMLElement | null>(null);
  const nestedContentRowRef = useCallback(
    (node: HTMLElement | null) => {
      nestedRowNodeRef.current = node;
      if (node) {
        node.id = nestedContentId;
        node.removeAttribute("aria-labelledby");
        node.setAttribute(
          "aria-label",
          msg.format("nestedContentRow", { rowId: rowKey })
        );
      }
    },
    [nestedContentId, msg, rowKey]
  );

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

  const defaultDataCells = (cols: DataTableColumnItem<T>[]) => (
    <RaCollection items={cols}>
      {(col: DataTableColumnItem<T>) => {
        const cellValue = col.accessor(row);
        const align = col.align ?? "start";
        const isStretch = align === "stretch";

        return (
          <DataTableCell
            isDisabled={isDisabled}
            key={col.id}
            data-column-id={col.id}
            textAlign={
              align === "center"
                ? "center"
                : align === "end"
                  ? "end"
                  : undefined
            }
          >
            <Box
              className={isTruncated ? "truncated-cell" : ""}
              data-truncated={isTruncated ? "true" : "false"}
              display={isStretch ? "block" : "inline-block"}
              w={isStretch ? "100%" : undefined}
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
  );

  return (
    <>
      <DataTableRowSlot asChild {...styleProps}>
        <RaRow
          isDisabled={isDisabled}
          columns={activeColumns}
          ref={rowRef}
          id={rowKey}
          hasChildItems={
            !!(hasRenderNestedContent || hasNestedContent) || undefined
          }
          {...restProps}
          data-clickable={isClickable && !isDisabled}
          data-custom-bg={hasCustomBg || undefined}
          className={`data-table-row ${isDisabled ? "data-table-row-disabled" : ""} ${isPinned ? `data-table-row-pinned ${getPinnedRowClasses()}` : ""}${consumerClassName ? ` ${consumerClassName}` : ""}`}
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
          {showSelectionColumn && (
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
              {hasNestedContent || hasRenderNestedContent ? (
                // TODO:Button does not occupy the whole height
                <IconButton
                  w="100%"
                  h="100%"
                  unstyled
                  cursor="pointer"
                  focusVisibleRing="inside"
                  borderRadius="0"
                  color="neutral.10"
                  aria-label={
                    isExpanded
                      ? msg.format("collapseRow")
                      : msg.format("expandRow")
                  }
                  onPress={() => toggleExpand(rowKey)}
                >
                  {isExpanded ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
                </IconButton>
              ) : null}
            </DataTableCell>
          )}
          {/* Data cells */}
          {children
            ? children({ columns: activeColumns, row, isDisabled })
            : defaultDataCells(activeColumns)}
          {showPinColumn && (
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
                title={pinLabel}
              >
                <IconToggleButton
                  key="pin-btn"
                  size="2xs"
                  variant="ghost"
                  aria-label={pinLabel}
                  colorPalette="primary"
                  isSelected={isPinned}
                  onChange={() => togglePin(rowKey)}
                >
                  <PushPin />
                </IconToggleButton>
              </Box>
            </DataTableCell>
          )}
        </RaRow>
      </DataTableRowSlot>

      {/* The nested row exists only while its row is expanded. A hidden
       * row would still be in React Aria's collection, so arrow keys would
       * stop on it and the grid's row count would include it. */}
      {hasExpandableContent && isExpanded && (
        <DataTableRowSlot {...styleProps} asChild>
          <RaRow
            ref={hasRenderNestedContent ? nestedContentRowRef : undefined}
            data-nested-row-expanded="true"
          >
            <DataTableCell
              isDisabled={isDisabled}
              colSpan={
                activeColumns.length +
                (allowsDragging ? 1 : 0) +
                (showExpandColumn ? 1 : 0) +
                (showSelectionColumn ? 1 : 0) +
                (showPinColumn ? 1 : 0)
              }
              data-nested-cell
            >
              {hasNestedContent
                ? nestedKey && Array.isArray(row[nestedKey])
                  ? msg.format("nestedItemsCount", {
                      count: (row[nestedKey] as unknown[]).length,
                    })
                  : nestedKey && (row[nestedKey] as React.ReactNode)
                : renderNestedContent && (
                    <NestedContentPanel
                      rowKey={rowKey}
                      nestedRowRef={nestedRowNodeRef}
                      openerCellIndex={
                        showExpandColumn
                          ? (allowsDragging ? 1 : 0) +
                            (showSelectionColumn ? 1 : 0)
                          : undefined
                      }
                      onClose={() => toggleExpand(rowKey)}
                    >
                      {(close) => renderNestedContent(row, { close })}
                    </NestedContentPanel>
                  )}
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
