import { ColumnResizer, Column as RaColumn } from "react-aria-components";
import { ArrowDownward } from "@commercetools/nimbus-icons";
import { Flex, Separator } from "@/components";
import { extractStyleProps } from "@/utils";
import { useLocalizedStringFormatter } from "@/hooks";
import { useStableDataTableContext } from "./data-table.context";
import {
  DataTableColumnSlot,
  DataTableHeaderSortIcon,
  DataTableColumnResizer,
} from "../data-table.slots";
import type { DataTableColumnComponent } from "../data-table.types";
import { dataTableMessagesStrings } from "../data-table.messages";

/**
 * DataTable.Column - Individual column header component that handles sorting interactions
 *
 * @supportsStyleProps
 */
export const DataTableColumn: DataTableColumnComponent = ({
  children,
  ref,
  column,
  isInternalColumn,
  width,
  minWidth,
  maxWidth,
  ...otherProps
}) => {
  const msg = useLocalizedStringFormatter(dataTableMessagesStrings);
  // Only configuration here. The sort state comes from React Aria's render
  // props below, so expanding, pinning or selecting a row does not re-render
  // every column header.
  const { isResizable } = useStableDataTableContext();
  const isColumnResizable =
    column?.isResizable !== undefined ? column?.isResizable : isResizable;

  const [styleProps, restProps] = extractStyleProps(otherProps);

  return (
    <DataTableColumnSlot {...styleProps} asChild>
      <RaColumn
        width={width}
        minWidth={minWidth}
        maxWidth={maxWidth}
        ref={ref}
        {...restProps}
      >
        {(renderProps) => {
          // `sortDirection` is set only for the sorted column. It is the
          // value React Aria uses for this header's `aria-sort`.
          const { allowsSorting, sortDirection } = renderProps;

          if (isInternalColumn) {
            return typeof children === "function"
              ? children(renderProps)
              : children;
          }
          return (
            <Flex
              // https://react-spectrum.adobe.com/react-aria/Table.html#width-values
              tabIndex={isColumnResizable || allowsSorting ? -1 : 0}
              className="nimbus-data-table__column-container"
            >
              <Separator
                orientation="vertical"
                className="data-table-column-divider"
              />
              {typeof children === "function"
                ? children(renderProps)
                : children}
              {allowsSorting && (
                <DataTableHeaderSortIcon
                  aria-hidden="true"
                  data-sort-active={sortDirection !== undefined}
                  data-sort-direction={sortDirection ?? "none"}
                >
                  <ArrowDownward />
                </DataTableHeaderSortIcon>
              )}
              {isColumnResizable && (
                <ColumnResizer aria-label={msg.format("resizeColumn")}>
                  {({ isResizing, isFocused, isHovered }) => (
                    <DataTableColumnResizer
                      data-resizing={isResizing}
                      data-focused={isFocused}
                      data-hovered={isHovered}
                    />
                  )}
                </ColumnResizer>
              )}
            </Flex>
          );
        }}
      </RaColumn>
    </DataTableColumnSlot>
  );
};

DataTableColumn.displayName = "DataTable.Column";
