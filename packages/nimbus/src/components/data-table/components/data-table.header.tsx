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
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);

  const handleHoverStart = useCallback(() => setIsHeaderHovered(true), []);
  const handleHoverEnd = useCallback(() => setIsHeaderHovered(false), []);
  const handleBlur = useCallback(() => setFocusedColumn(null), []);

  // Render sort indicator
  const renderSortIndicator = (columnId: string) => {
    if (!allowsSorting) return null;

    const column = visibleCols.find((col) => col.id === columnId);
    if (column?.isSortable === false) return null;

    const isActive = sortDescriptor?.column === columnId;
    const isHovered = hoveredColumn === columnId;
    const direction = sortDescriptor?.direction;

    // If not sorted and not hovered, don't show any icon
    if (!isActive && !isHovered) {
      return null;
    }

    const rotation = direction === "ascending" ? "180deg" : "0deg";

    return (
      <DataTableHeaderSortIcon
        color={isActive ? "neutral.11" : "neutral.10"}
        style={{
          transform: `rotate(${rotation})`,
          transition: "transform 100ms",
          opacity: 1,
        }}
      >
        <South />
      </DataTableHeaderSortIcon>
    );
  };

  return (
    <AriaTableHeader
      ref={ref}
      className="data-table-header"
      style={{
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

      {showExpandColumn && (
        <AriaColumn
          id="expand"
          width={20}
          minWidth={20}
          maxWidth={20}
          allowsSorting={false}
        />
      )}

      {visibleCols.map((col, index) => {
        const isSortable = allowsSorting && col.isSortable !== false;
        const isLastColumn = index === visibleCols.length - 1;
        return (
          <AriaColumn
            allowsSorting={isSortable}
            key={col.id}
            id={col.id}
            isRowHeader
            width={col.width}
            defaultWidth={col.defaultWidth}
            minWidth={col.minWidth}
            maxWidth={col.maxWidth}
          >
            {isHeaderHovered && !isLastColumn && (
              <Divider
                orientation="vertical"
                color="gray.200"
                className="data-table-header-divider"
              />
            )}
            <div
              tabIndex={0}
              onFocus={() => setFocusedColumn(col.id)}
              onMouseEnter={() => setHoveredColumn(col.id)}
              onMouseLeave={() => setHoveredColumn(null)}
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
                      transition: "background 100ms",
                      background: isResizing ? "#3182ce" : "transparent",
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
