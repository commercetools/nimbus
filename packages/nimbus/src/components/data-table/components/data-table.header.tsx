import { forwardRef, useState } from "react";
import {
  TableHeader as AriaTableHeader,
  Column as AriaColumn,
  ColumnResizer,
} from "react-aria-components";
import { useDataTableContext } from "./data-table.root";

export interface DataTableHeaderProps {}

export const DataTableHeader = forwardRef<HTMLTableSectionElement, DataTableHeaderProps>(
  function DataTableHeader(props, ref) {
    const {
      visibleCols,
      sortDescriptor,
      onSortChange,
      allowsSorting,
      stickyHeader,
      showSelectionColumn,
      showExpandColumn,
      selectionMode,
      isAllSelected,
      isIndeterminate,
      handleSelectAll,
    } = useDataTableContext();

    const [isHeaderHovered, setIsHeaderHovered] = useState(false);

    // Convert sort descriptor to react-aria format
    const ariaSortDescriptor = sortDescriptor
      ? {
          column: sortDescriptor.column,
          direction: sortDescriptor.direction,
        }
      : undefined;

    // Handle sort change from react-aria
    const handleAriaSort = (descriptor: any) => {
      if (descriptor && onSortChange) {
        onSortChange({
          column: descriptor.column,
          direction: descriptor.direction,
        });
      }
    };

    // Render sort indicator
    const renderSortIndicator = (columnId: string) => {
      if (!allowsSorting) return null;
      
      const column = visibleCols.find((col) => col.id === columnId);
      if (column?.isSortable === false) return null;

      const isActive = sortDescriptor?.column === columnId;
      const direction = sortDescriptor?.direction;

      return (
        <span 
          style={{ 
            opacity: isActive ? 1 : 0.4,
            fontSize: '10px',
            transition: 'opacity 0.2s ease, color 0.2s ease',
            display: 'inline-flex',
            alignItems: 'center',
            width: '12px',
            height: '12px',
            justifyContent: 'center',
            color: isActive ? '#2563eb' : '#6b7280',
            fontWeight: 'bold'
          }}
        >
          {!isActive ? '⇅' : direction === 'ascending' ? '↑' : '↓'}
        </span>
      );
    };

    return (
      <AriaTableHeader
        ref={ref}
        style={{
          background: "#F7F7F7",
          borderBottom: "1px solid #E0E0E0",
          ...(stickyHeader && {
            position: "sticky",
            top: 0,
            zIndex: 10,
            boxShadow: stickyHeader ? "0 2px 4px #E0E0E0" : undefined,
          }),
        }}
        onHoverStart={() => setIsHeaderHovered(true)}
        onHoverEnd={() => setIsHeaderHovered(false)}
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
            style={{ 
              textAlign: "left",
              padding: "16px",
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'left'
            }}
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
                  cursor: 'pointer'
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
        {visibleCols.map((col) => {
          const isSortable = allowsSorting && col.isSortable !== false;
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
                padding: "16px",
                borderRight: isHeaderHovered ? "1px solid #E0E0E0" : "none",
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <span>{col.header}</span>
                {renderSortIndicator(col.id)}
              </div>
              {col.isAdjustable !== false && (
                <ColumnResizer>
                  {({ isResizing }) => (
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
  }
);

DataTableHeader.displayName = "DataTable.Header"; 