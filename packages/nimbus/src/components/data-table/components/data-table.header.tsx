import { forwardRef, useState, useCallback } from "react";
import {
  TableHeader as AriaTableHeader,
  Column as AriaColumn,
  ColumnResizer,
} from "react-aria-components";
import { DataTableHeaderSortIcon } from "../data-table.slots";
import { useDataTableContext } from "./data-table.root";
import { South, SwapVert, Info } from "@commercetools/nimbus-icons";
import { Divider } from "@/components";

export interface DataTableHeaderProps {}

export const DataTableHeader = forwardRef<
  HTMLTableSectionElement,
  DataTableHeaderProps
>(function DataTableHeader(props, ref) {
  const {
    visibleCols,
    sortDescriptor,
    onSortChange,
    allowsSorting,
    maxHeight,
    showSelectionColumn,
    showExpandColumn,
    selectionMode,
    isAllSelected,
    isIndeterminate,
    handleSelectAll,
  } = useDataTableContext();

  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const [focusedColumn, setFocusedColumn] = useState<string | null>(null);

  const handleHoverStart = useCallback(() => setIsHeaderHovered(true), []);
  const handleHoverEnd = useCallback(() => setIsHeaderHovered(false), []);
  const handleBlur = useCallback(() => setFocusedColumn(null), []);

  // Render sort indicator
  const renderSortIndicator = (columnId: string) => {
    if (!allowsSorting) return null;

    const column = visibleCols.find((col) => col.id === columnId);
    if (column?.isSortable === false) return null;

    const isActive = sortDescriptor?.column === columnId;
    const direction = sortDescriptor?.direction;

    // For unsorted state, show SwapVert without animation
    // For active states, use North/South with rotation animation
    if (!isActive) {
      return (
        <DataTableHeaderSortIcon>
          <SwapVert />
        </DataTableHeaderSortIcon>
      );
    }

    // For active states, use a single arrow with rotation animation
    const rotation = direction === "ascending" ? "180deg" : "0deg";

    return (
      <DataTableHeaderSortIcon
        style={{
          transform: `rotate(${rotation})`,
        }}
      >
        <South />
      </DataTableHeaderSortIcon>
    );
  };

  return (
    <AriaTableHeader
      ref={ref}
      style={{
        background: "#F7F7F7",
        height: "36px",
        fontSize: "0.75rem",
        color: "#4b5563", // Slightly darker grey for headers
        borderBottom: "1px solid hsl(232, 18%, 95%)",
        ...(maxHeight && {
          position: "sticky",
          top: 0,
          zIndex: 10,
        }),
      }}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      {...props}
    >
      {/* Selection column header if selection is enabled */}
      {showSelectionColumn && (
        <AriaColumn
          id="selection"
          className="selection-column-header"
          width={60}
          minWidth={60}
          maxWidth={60}
          allowsSorting={false}
        >
          {selectionMode === "multiple" && (
            <input
              type="checkbox"
              checked={isAllSelected()}
              ref={(el) => {
                if (el) {
                  el.indeterminate = isIndeterminate();
                }
              }}
              onChange={(e) => handleSelectAll(e.target.checked)}
              style={{
                width: 16,
                height: 16,
                cursor: "pointer",
              }}
            />
          )}
        </AriaColumn>
      )}

      {/* Expand/collapse column header if needed */}
      {showExpandColumn && (
        <AriaColumn
          id="expand"
          width={20}
          minWidth={20}
          maxWidth={20}
          allowsSorting={false}
        />
      )}

      {/* Data columns */}
      {visibleCols.map((col, index) => {
        const isSortable = allowsSorting && col.isSortable !== false;
        const isLastColumn = index === visibleCols.length - 1;
        return (
          <AriaColumn
            allowsSorting={isSortable}
            key={col.id}
            id={col.id}
            isRowHeader
            // allowsResizing={col.isAdjustable !== false} // TODO: Fix prop name
            width={col.width}
            defaultWidth={col.defaultWidth}
            minWidth={col.minWidth}
            maxWidth={col.maxWidth}
            style={{
              textAlign: "left",
              position: "relative",
            }}
          >
            {/* Inset border divider */}
            {isHeaderHovered && !isLastColumn && (
              <Divider
                orientation="vertical"
                color="gray.200"
                style={{
                  position: "absolute",
                  right: 0,
                  top: "10%",
                  bottom: "10%",
                  height: "80%",
                  width: "1px",
                  pointerEvents: "none",
                }}
              />
            )}
            <div
              tabIndex={0}
              onFocus={() => setFocusedColumn(col.id)}
              onBlur={handleBlur}
              style={{
                cursor: isSortable ? "pointer" : "default",
              }}
            >
              <span style={{}}>{col.header}</span>
              {col.headerIcon && (
                <span style={{ marginLeft: "8px" }}>{col.headerIcon}</span>
              )}
              {renderSortIndicator(col.id)}
            </div>
            {col.isAdjustable !== false && !isLastColumn && (
              <ColumnResizer aria-label="Resize column">
                {({ isResizing, isFocused }) => (
                  <div
                    style={{
                      width: 4,
                      height: "100%",
                      position: "absolute",
                      right: 0,
                      top: 0,
                      cursor: "col-resize",
                      background: isResizing ? "#3182ce" : "transparent",
                      transition: "background 0.2s",
                      outline: isFocused ? "1px solid #3182ce" : "none",
                      zIndex: 2,
                    }}
                  />
                )}
              </ColumnResizer>
            )}
          </AriaColumn>
        );
      })}
    </AriaTableHeader>
  );
});

DataTableHeader.displayName = "DataTable.Header";
