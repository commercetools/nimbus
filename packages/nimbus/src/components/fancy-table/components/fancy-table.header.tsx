import React from "react";
import {
  TableHeader,
  Collection,
  useTableOptions,
  Checkbox,
} from "react-aria-components";
import {
  FancyTableHeaderSlot,
  FancyTableCheckboxSlot,
} from "../fancy-table.slots";
import { FancyTableColumn } from "./fancy-table.column";
import { extractStyleProps } from "@/utils/extractStyleProps";
import type { FancyTableHeaderProps } from "../fancy-table.types";

export const FancyTableHeader = React.forwardRef<
  HTMLTableSectionElement,
  FancyTableHeaderProps
>(({ columns, children, ...props }, ref) => {
  const [styleProps, restProps] = extractStyleProps(props);
  const { selectionBehavior, selectionMode, allowsDragging } =
    useTableOptions();

  return (
    <FancyTableHeaderSlot asChild {...styleProps}>
      <TableHeader ref={ref} {...restProps}>
        {/* Extra columns for drag and selection */}
        {allowsDragging && <FancyTableColumn />}
        {selectionBehavior === "toggle" && (
          <FancyTableColumn>
            {selectionMode === "multiple" && (
              <FancyTableCheckboxSlot asChild>
                <Checkbox slot="selection" />
              </FancyTableCheckboxSlot>
            )}
          </FancyTableColumn>
        )}

        {/* Data columns */}
        {columns && children ? (
          <Collection items={columns}>
            {typeof children === "function" ? children : () => children}
          </Collection>
        ) : (
          children
        )}
      </TableHeader>
    </FancyTableHeaderSlot>
  );
});

FancyTableHeader.displayName = "FancyTableHeader";
