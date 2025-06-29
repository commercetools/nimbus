import React from "react";
import { Column, ColumnResizer, Button } from "react-aria-components";
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

export const FancyTableColumn = React.forwardRef<
  HTMLTableCellElement,
  FancyTableColumnProps & { children?: React.ReactNode }
>(({ children, allowsResizing = false, allowsSorting, ...props }, ref) => {
  const [styleProps, restProps] = extractStyleProps(props);

  if (allowsResizing) {
    return (
      <FancyTableColumnSlot asChild {...styleProps}>
        <Column ref={ref} {...restProps}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <FancyTableColumnHeaderSlot asChild>
              <div style={{ flex: 1 }}>
                <span
                  style={{
                    display: "block",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {children}
                </span>
              </div>
            </FancyTableColumnHeaderSlot>
            <FancyTableColumnResizerSlot asChild>
              <ColumnResizer />
            </FancyTableColumnResizerSlot>
          </div>
        </Column>
      </FancyTableColumnSlot>
    );
  }

  return (
    <FancyTableColumnSlot asChild {...styleProps}>
      <Column ref={ref} {...restProps}>
        {children}
      </Column>
    </FancyTableColumnSlot>
  );
});

FancyTableColumn.displayName = "FancyTableColumn";
