import { VisuallyHidden } from "react-aria";
import { useLocale } from "react-aria-components";
import {
  TableHeader as RaTableHeader,
  Collection as RaCollection,
  useTableOptions,
} from "react-aria-components";
import { Box, Checkbox } from "@/components";
import { extractStyleProps } from "@/utils";
import type {
  DataTableHeaderProps,
  DataTableColumnItem,
} from "../data-table.types";
import { DataTableHeaderSlot } from "../data-table.slots";
import { useDataTableContext } from "./data-table.context";
import { DataTableColumn } from "./data-table.column";
import { dataTableMessages } from "../data-table.messages";

/**
 * DataTable.Header - The table header section that renders column headers with sorting capabilities
 *
 * @supportsStyleProps
 */
export const DataTableHeader = <
  T extends DataTableColumnItem = DataTableColumnItem,
>({
  ref,
  ...props
}: DataTableHeaderProps<T>) => {
  const { locale } = useLocale();
  const { activeColumns, allowsSorting, maxHeight, showExpandColumn } =
    useDataTableContext();
  // This can also be used to see if drag'n'drop is enabled
  const { selectionBehavior, selectionMode } = useTableOptions();
  const [styleProps, restProps] = extractStyleProps(props);
  return (
    <DataTableHeaderSlot {...styleProps} asChild>
      <RaTableHeader
        ref={ref}
        className="data-table-header"
        {...(maxHeight && { ["data-sticky"]: true })}
        columns={activeColumns}
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
            aria-label={dataTableMessages.getStringLocale("expandRows", locale)}
            isInternalColumn={true}
          >
            <VisuallyHidden>
              {dataTableMessages.getStringLocale("expandRows", locale)}
            </VisuallyHidden>
          </DataTableColumn>
        )}
        <RaCollection items={activeColumns}>
          {(column) => {
            return (
              <DataTableColumn
                allowsSorting={
                  // use column.isSortable if defined, and fallback to allowsSorting if not
                  column.isSortable !== undefined
                    ? column.isSortable
                    : allowsSorting
                }
                isRowHeader={true}
                width={column.width}
                defaultWidth={column.defaultWidth}
                minWidth={column.minWidth ?? 150}
                maxWidth={column.maxWidth}
                column={column}
              >
                <span data-multiline-header>{column.header}</span>
                {column.headerIcon && (
                  <Box as="span" ml="200">
                    {column.headerIcon}
                  </Box>
                )}
              </DataTableColumn>
            );
          }}
        </RaCollection>
        <DataTableColumn
          className="pin-rows-column-header"
          id="pin-rows"
          maxWidth={72}
          minWidth={72}
          allowsSorting={false}
          isInternalColumn={true}
          aria-label={dataTableMessages.getStringLocale("pinRows", locale)}
        >
          <VisuallyHidden>
            {dataTableMessages.getStringLocale("pinRows", locale)}
          </VisuallyHidden>
        </DataTableColumn>
      </RaTableHeader>
    </DataTableHeaderSlot>
  );
};

DataTableHeader.displayName = "DataTable.Header";
