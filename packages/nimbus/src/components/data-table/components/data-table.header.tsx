import { VisuallyHidden } from "react-aria";
import {
  TableHeader as RaTableHeader,
  Collection as RaCollection,
  useTableOptions,
} from "react-aria-components";
import { Box, Checkbox } from "@/components";
import { extractStyleProps } from "@/utils/extractStyleProps";
import type {
  DataTableHeaderProps,
  DataTableColumnItem,
} from "../data-table.types";
import { DataTableHeaderSlot } from "../data-table.slots";
import { useDataTableContext } from "./data-table.context";
import { DataTableColumn } from "./data-table.column";

export const DataTableHeader = <
  T extends DataTableColumnItem = DataTableColumnItem,
>({
  ref,
  ...props
}: DataTableHeaderProps<T>) => {
  const { activeColumns, allowsSorting, maxHeight, showExpandColumn } =
    useDataTableContext();
  // This can also be used to see if drag'n'drop is enabled
  const { selectionBehavior, selectionMode } = useTableOptions();
  const [styleProps, restProps] = extractStyleProps(props);
  return (
    <DataTableHeaderSlot asChild {...styleProps}>
      <RaTableHeader
        ref={ref}
        className="data-table-header"
        columns={activeColumns}
        {...(maxHeight && { ["data-sticky"]: true })}
        {...restProps}
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
            // Don't add so much padding if the selection column is first
            maxWidth={selectionBehavior === "toggle" ? 24 : 72}
            minWidth={selectionBehavior === "toggle" ? 24 : 72}
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
                width={isDetailsColumn ? 96 : column.width}
                defaultWidth={isDetailsColumn ? 96 : column.defaultWidth}
                // Set the default data column minWidth to 150 (this is an arbitrary number)
                minWidth={isDetailsColumn ? 96 : (column.minWidth ?? 150)}
                maxWidth={isDetailsColumn ? 96 : column.maxWidth}
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
    </DataTableHeaderSlot>
  );
};

DataTableHeader.displayName = "DataTable.Header";
