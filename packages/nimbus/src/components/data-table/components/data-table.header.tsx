import { forwardRef } from "react";
import { VisuallyHidden } from "react-aria";
import {
  TableHeader as RaTableHeader,
  Collection as RaCollection,
  useTableOptions,
} from "react-aria-components";
import { useDataTableContext } from "./data-table.context";
import { DataTableColumn } from "./data-table.column";
import { Box, Checkbox } from "@/components";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DataTableHeaderProps {}

export const DataTableHeader = forwardRef<
  HTMLTableSectionElement,
  DataTableHeaderProps
>(function DataTableHeader(props, ref) {
  const { activeColumns, allowsSorting, maxHeight, showExpandColumn } =
    useDataTableContext();
  // This can also be used to see if drag'n'drop is enabled
  const { selectionBehavior, selectionMode } = useTableOptions();

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
      columns={activeColumns}
      {...props}
    >
      {/** Internal/non-data columns like selection and expand
       * need to be in the same order in the header and row components*/}
      {selectionBehavior === "toggle" && (
        <DataTableColumn
          id="selection"
          className="selection-column-header"
          maxWidth={72}
          minWidth={72}
          allowsSorting={false}
          isInternalColumn={true}
        >
          {selectionMode === "multiple" && <Checkbox slot="selection" />}
        </DataTableColumn>
      )}
      {showExpandColumn && (
        <DataTableColumn
          className="expand-column-header"
          maxWidth={24}
          minWidth={24}
          allowsSorting={false}
          aria-label="Expand rows"
          isInternalColumn={true}
        >
          <VisuallyHidden>Expand rows</VisuallyHidden>
        </DataTableColumn>
      )}
      <RaCollection items={activeColumns}>
        {(column) => {
          const isDetailsColumn =
            column.id === "nimbus-data-table-details-column";

          return (
            <DataTableColumn
              allowsSorting={
                // use column.isSortable if defined, and fallback to allowsSorting if not
                column.isSortable !== undefined
                  ? column.isSortable
                  : allowsSorting
              }
              isRowHeader={isDetailsColumn ? false : true}
              isInternalColumn={isDetailsColumn}
              width={column.width}
              defaultWidth={column.defaultWidth}
              minWidth={column.minWidth ?? 150}
              maxWidth={column.maxWidth}
              column={column}
            >
              {isDetailsColumn ? (
                <VisuallyHidden>Details</VisuallyHidden>
              ) : (
                <>
                  <span data-multiline-header>{column.header}</span>
                  {column.headerIcon && (
                    <Box as="span" ml="200">
                      {column.headerIcon}
                    </Box>
                  )}
                </>
              )}
            </DataTableColumn>
          );
        }}
      </RaCollection>
    </RaTableHeader>
  );
});

DataTableHeader.displayName = "DataTable.Header";
