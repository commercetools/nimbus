import React from "react";
import { Cell } from "react-aria-components";
import { FancyTableCellSlot } from "../fancy-table.slots";
import { extractStyleProps } from "@/utils/extractStyleProps";
import type { FancyTableCellProps } from "../fancy-table.types";

export const FancyTableCell = React.forwardRef<
  HTMLTableCellElement,
  FancyTableCellProps
>(({ children, column, item, ...props }, ref) => {
  const [styleProps, restProps] = extractStyleProps(props);

  return (
    <FancyTableCellSlot asChild {...styleProps}>
      <Cell ref={ref} {...restProps}>
        {children}
      </Cell>
    </FancyTableCellSlot>
  );
});

FancyTableCell.displayName = "FancyTableCell";
