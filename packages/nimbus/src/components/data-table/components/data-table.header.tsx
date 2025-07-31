import { forwardRef, useState, useCallback } from "react";
import {
  TableHeader as RaTableHeader,
  Column as RaColumn,
  ColumnResizer,
} from "react-aria-components";
import { DataTableHeaderSortIcon, DataTableColumnResizer } from "../data-table.slots";
import { useDataTableContext } from "./data-table.root";
import { ArrowDownward } from "@commercetools/nimbus-icons";
import { Divider, Checkbox } from "@/components";

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
    showDetailsColumn,
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
        aria-hidden="true"
        color={isActive ? "neutral.11" : "neutral.10"}
        style={{
          transform: `rotate(${rotation})`,
        }}
      >
        <ArrowDownward />
      </DataTableHeaderSortIcon>
    );
  };

  return (
    <RaTableHeader
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
        <RaColumn
          id="selection"
          className="selection-column-header"
          width={70}
          allowsSorting={false}
          aria-label={selectionMode === "multiple" ? "Select all rows" : "Select row"}
        >
          {selectionMode === "multiple" && (
            <Checkbox
              isSelected={isAllSelected()}
              isIndeterminate={isIndeterminate()}
              aria-label="Select all rows"
              onChange={(isSelected) => handleSelectAll(Boolean(isSelected))}
            />
          )}
        </RaColumn>
      )}

      {showExpandColumn && (
        <RaColumn
          id="expand"
          width={20}
          minWidth={20}
          maxWidth={20}
          allowsSorting={false}
          aria-label="Expand rows"
        >
          <span style={{ 
            position: "absolute", 
            width: "1px", 
            height: "1px", 
            padding: 0, 
            margin: "-1px", 
            overflow: "hidden", 
            clip: "rect(0, 0, 0, 0)", 
            whiteSpace: "nowrap", 
            border: 0 
          }}>
            Expand rows
          </span>
        </RaColumn>
      )}

      {visibleCols.map((col, index) => {
        const isSortable = allowsSorting && col.isSortable !== false;
        const isLastColumn = index === visibleCols.length - 1;
        return (
          <>
            <RaColumn
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
                <span data-multiline-header>{col.header}</span>
                {col.headerIcon && (
                  <span style={{ marginLeft: "8px" }}>{col.headerIcon}</span>
                )}
                {renderSortIndicator(col.id)}
              </div>
              {col.isAdjustable !== false && !isLastColumn && (
                <ColumnResizer aria-label="Resize column">
                  {({ isResizing, isFocused }) => (
                    <DataTableColumnResizer
                      data-resizing={isResizing}
                      data-focused={isFocused}
                    />
                  )}
                </ColumnResizer>
              )}
            </RaColumn>

            {/* Details column header - shown after first data column */}
            {showDetailsColumn && index === 0 && (
              <RaColumn
                key="details-header"
                id="details"
                className="details-column-header"
                width={70}
                allowsSorting={false}
                aria-label="Row details"
              >
                <span style={{ 
                  position: "absolute", 
                  width: "1px", 
                  height: "1px", 
                  padding: 0, 
                  margin: "-1px", 
                  overflow: "hidden", 
                  clip: "rect(0, 0, 0, 0)", 
                  whiteSpace: "nowrap", 
                  border: 0 
                }}>
                  Details
                </span>
              </RaColumn>
            )}
          </>
        );
      })}
    </RaTableHeader>
  );
});

DataTableHeader.displayName = "DataTable.Header";
