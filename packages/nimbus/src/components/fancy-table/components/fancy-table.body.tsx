import React from "react";
import { TableBody } from "react-aria-components";
import {
  FancyTableBodySlot,
  FancyTableEmptyStateSlot,
} from "../fancy-table.slots";
import { FancyTableRow } from "./fancy-table.row";
import { extractStyleProps } from "@/utils/extractStyleProps";
import type { FancyTableBodyProps } from "../fancy-table.types";

export const FancyTableBody = React.forwardRef<
  HTMLTableSectionElement,
  FancyTableBodyProps
>(
  (
    { columns, renderCell, renderEmptyState, items, children, ...props },
    ref
  ) => {
    const [styleProps, restProps] = extractStyleProps(props);

    const defaultEmptyState = () => (
      <FancyTableEmptyStateSlot>No data available</FancyTableEmptyStateSlot>
    );

    return (
      <FancyTableBodySlot asChild {...styleProps}>
        <TableBody
          ref={ref}
          items={items}
          renderEmptyState={renderEmptyState || defaultEmptyState}
          {...restProps}
        >
          {children ||
            ((item) => (
              <FancyTableRow
                key={item.id}
                id={item.id}
                columns={columns}
                renderCell={renderCell}
                item={item}
              />
            ))}
        </TableBody>
      </FancyTableBodySlot>
    );
  }
);

FancyTableBody.displayName = "FancyTableBody";
