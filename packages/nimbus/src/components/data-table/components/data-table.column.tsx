import { ColumnResizer, Column as RaColumn } from "react-aria-components";
import { ArrowDownward } from "@commercetools/nimbus-icons";
import { Divider, Flex } from "@/components";
import { useDataTableContext } from "./data-table.context";
import {
  DataTableColumnSlot,
  DataTableHeaderSortIcon,
  DataTableColumnResizer,
} from "../data-table.slots";
import type { DataTableColumnComponent } from "../data-table.types";

export const DataTableColumn: DataTableColumnComponent = ({
  children,
  ref,
  column,
  unstyled,
  isInternalColumn,
  tabIndex,
  ...otherProps
}) => {
  const { sortDescriptor, isResizable } = useDataTableContext();
  const isActive = sortDescriptor?.column === column?.id;
  const isColumnResizable =
    column?.isResizable !== undefined ? column?.isResizable : isResizable;
  /**
   * TODO: Pass styles to DataTableColumnSlot from props,
   * except for height/minHeight/maxHeight which enable react-aria's
   * column resizing
   */
  return (
    <DataTableColumnSlot unstyled={unstyled} tabIndex={tabIndex} asChild>
      <RaColumn ref={ref} {...otherProps}>
        {(renderProps) => {
          const { allowsSorting } = renderProps;

          if (isInternalColumn) {
            return typeof children === "function"
              ? children(renderProps)
              : children;
          }
          return (
            <Flex tabIndex={column?.isResizable ? 0 : -1} focusRing="outside">
              <Divider
                orientation="vertical"
                className="data-table-column-divider"
              />
              {typeof children === "function"
                ? children(renderProps)
                : children}
              {allowsSorting && (
                <DataTableHeaderSortIcon
                  aria-hidden="true"
                  color={isActive ? "neutral.11" : "neutral.10"}
                >
                  <ArrowDownward />
                </DataTableHeaderSortIcon>
              )}
              {isColumnResizable && (
                <ColumnResizer aria-label="Resize column">
                  {({ isResizing, isFocused }) => (
                    <DataTableColumnResizer
                      data-resizing={isResizing}
                      data-focused={isFocused}
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
