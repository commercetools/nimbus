import React from "react";
import { Column, ColumnResizer } from "react-aria-components";
// Using simple text indicators instead of icons for now
// import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  FancyTableColumnSlot,
  FancyTableColumnHeaderSlot,
  FancyTableColumnResizerSlot,
  FancyTableSortIndicatorSlot,
} from "../fancy-table.slots";
import { extractStyleProps } from "@/utils/extractStyleProps";
import type { FancyTableColumnProps } from "../fancy-table.types";
import { Flex } from "@/components";
import { ArrowDownward, ArrowUpward } from "@commercetools/nimbus-icons";

export const FancyTableColumn = React.forwardRef<
  HTMLTableCellElement,
  FancyTableColumnProps & { children?: React.ReactNode }
>(({ children, allowsResizing = false, ...props }, ref) => {
  const [styleProps, restProps] = extractStyleProps(props);

  return (
    <FancyTableColumnSlot asChild {...styleProps}>
      <Column ref={ref} {...restProps}>
        {({ allowsSorting, sortDirection }) => (
          <Flex>
            <FancyTableColumnHeaderSlot>
              {children}
              {allowsSorting && (
                <FancyTableSortIndicatorSlot>
                  {sortDirection &&
                    (sortDirection === "ascending" ? (
                      <ArrowUpward />
                    ) : (
                      <ArrowDownward />
                    ))}
                </FancyTableSortIndicatorSlot>
              )}
            </FancyTableColumnHeaderSlot>
            {allowsResizing && (
              <FancyTableColumnResizerSlot asChild>
                <ColumnResizer />
              </FancyTableColumnResizerSlot>
            )}
          </Flex>
        )}
      </Column>
    </FancyTableColumnSlot>
  );
});

FancyTableColumn.displayName = "FancyTableColumn";
