import { VisuallyHidden } from "react-aria";
import {
  TableHeader as RaTableHeader,
  Collection as RaCollection,
  useTableOptions,
} from "react-aria-components";
import { Box, Checkbox, Icon } from "@/components";
import { KeyboardArrowRight, PushPin } from "@commercetools/nimbus-icons";
import { extractStyleProps } from "@/utils";
import { useLocalizedStringFormatter } from "@/hooks";
import type {
  DataTableHeaderProps,
  DataTableColumnItem,
} from "../data-table.types";
import { DataTableHeaderSlot } from "../data-table.slots";
import { useDataTableContext } from "./data-table.context";
import { DataTableColumn } from "./data-table.column";
import { dataTableMessagesStrings } from "../data-table.messages";
import { DATA_TABLE_INTERNAL_COLUMN_WIDTHS } from "../utils/sizes.utils";

/**
 * DataTable.Header - The table header section that renders column headers with sorting capabilities
 *
 * @supportsStyleProps
 */
export const DataTableHeader = <
  T extends DataTableColumnItem = DataTableColumnItem,
>({
  ref,
  children,
  "aria-label": ariaLabelProp,
  ...props
}: DataTableHeaderProps<T>) => {
  const msg = useLocalizedStringFormatter(dataTableMessagesStrings);
  const {
    activeColumns,
    allowsSorting,
    maxHeight,
    showExpandColumn,
    showPinColumn,
    size,
  } = useDataTableContext();
  const { selectionBehavior, selectionMode, allowsDragging } =
    useTableOptions();
  const [styleProps, restProps] = extractStyleProps(props);
  const internalWidths = DATA_TABLE_INTERNAL_COLUMN_WIDTHS[size];
  const expandWidth =
    selectionBehavior === "toggle"
      ? internalWidths.bare
      : internalWidths.padded;

  // Use provided aria-label or fall back to default
  const ariaLabel = ariaLabelProp ?? msg.format("dataTableHeader");

  const defaultDataColumns = (
    <RaCollection items={activeColumns}>
      {(column) => {
        const align = column.align ?? "start";
        return (
          <DataTableColumn
            // React Aria derives a column's collection key from
            // `rendered.props.id ?? item.key ?? item.id`, so the rendered
            // element has to carry the id. Column definitions can hold a
            // business `key` field, which would otherwise win and make
            // `onSortChange` report it instead of the column id. Setting it
            // here rather than inside DataTableColumn leaves a consumer's own
            // `id` on <DataTable.Column> free to override it.
            id={column.id}
            allowsSorting={
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
            textAlign={
              align === "center"
                ? "center"
                : align === "end" || align === "stretch"
                  ? "end"
                  : undefined
            }
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
  );

  return (
    <DataTableHeaderSlot {...styleProps} asChild>
      <RaTableHeader
        ref={ref}
        aria-label={ariaLabel}
        className="data-table-header"
        {...(maxHeight && { ["data-sticky"]: true })}
        columns={activeColumns}
        {...restProps}
      >
        {/** Internal/non-data columns like selection, drag, and expand
         * need to be in the same order in the header and row components*/}
        {allowsDragging && (
          <DataTableColumn
            id="__nimbus-drag__"
            className="drag-column-header"
            maxWidth={internalWidths.bare}
            minWidth={internalWidths.bare}
            allowsSorting={false}
            isInternalColumn={true}
            aria-label={msg.format("dragRowsColumn")}
          >
            <VisuallyHidden>{msg.format("dragRowsColumn")}</VisuallyHidden>
          </DataTableColumn>
        )}
        {selectionBehavior === "toggle" && (
          <DataTableColumn
            id="selection"
            className="selection-column-header"
            maxWidth={internalWidths.padded}
            minWidth={internalWidths.padded}
            allowsSorting={false}
            isInternalColumn={true}
          >
            {selectionMode === "multiple" && (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                w="100%"
                h="100%"
              >
                <Checkbox slot="selection" />
              </Box>
            )}
          </DataTableColumn>
        )}
        {showExpandColumn && (
          <DataTableColumn
            className="expand-column-header"
            maxWidth={expandWidth}
            minWidth={expandWidth}
            allowsSorting={false}
            aria-label={msg.format("expandRows")}
            isInternalColumn={true}
          >
            <VisuallyHidden>{msg.format("expandRows")}</VisuallyHidden>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              w="100%"
              h="100%"
              aria-hidden="true"
            >
              <Icon as={KeyboardArrowRight} boxSize="400" color="neutral.10" />
            </Box>
          </DataTableColumn>
        )}
        {children
          ? children({
              columns: activeColumns,
              allowsSorting: !!allowsSorting,
            })
          : defaultDataColumns}
        {showPinColumn && (
          <DataTableColumn
            className="pin-rows-column-header"
            id="pin-rows"
            maxWidth={internalWidths.padded}
            minWidth={internalWidths.padded}
            allowsSorting={false}
            isInternalColumn={true}
            aria-label={msg.format("pinRows")}
          >
            <VisuallyHidden>{msg.format("pinRows")}</VisuallyHidden>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              w="100%"
              h="100%"
              aria-hidden="true"
            >
              <Icon as={PushPin} boxSize="400" color="neutral.10" />
            </Box>
          </DataTableColumn>
        )}
      </RaTableHeader>
    </DataTableHeaderSlot>
  );
};

DataTableHeader.displayName = "DataTable.Header";
