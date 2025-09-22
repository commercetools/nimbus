import { ColumnResizer, Column as RaColumn } from "react-aria-components";
import { ArrowDownward } from "@commercetools/nimbus-icons";
import { Flex, Separator } from "@/components";
import { extractStyleProps } from "@/utils/extractStyleProps";
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
  isInternalColumn,
  width,
  minWidth,
  maxWidth,
  ...otherProps
}) => {
  const { sortDescriptor, isResizable } = useDataTableContext();
  const isActive = sortDescriptor?.column === column?.id;
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
          const { allowsSorting } = renderProps;

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
                  data-sort-active={isActive}
                  data-sort-direction={
                    isActive ? sortDescriptor?.direction : "none"
                  }
                >
                  <ArrowDownward />
                </DataTableHeaderSortIcon>
              )}
              {isColumnResizable && (
                <ColumnResizer aria-label="Resize column">
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
