import { ColumnResizer, Column as RaColumn } from "react-aria-components";
import { ArrowDownward } from "@commercetools/nimbus-icons";
import { Divider, Flex } from "@/components";
import { useDataTableContext } from "./data-table.root";
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
  ...otherProps
}) => {
  const { sortDescriptor } = useDataTableContext();
  const isActive = sortDescriptor?.column === column?.id;

  return (
    <DataTableColumnSlot unstyled={unstyled} asChild>
      <RaColumn ref={ref} {...otherProps}>
        {(renderProps) => {
          const { allowsSorting } = renderProps;

          if (isInternalColumn) {
            return typeof children === "function"
              ? children(renderProps)
              : children;
          }
          return (
            <Flex>
              <Divider
                orientation="vertical"
                color="gray.200"
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
              {column?.isResizable && (
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
