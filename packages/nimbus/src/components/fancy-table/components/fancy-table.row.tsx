import React from "react";
import {
  Row,
  Cell,
  Collection,
  useTableOptions,
  Button,
} from "react-aria-components";
import { Checkbox } from "@/components";
// Using simple text indicator instead of icon for now
// import { DragHandleIcon } from "@chakra-ui/icons";
import {
  FancyTableRowSlot,
  FancyTableCellSlot,
  FancyTableCheckboxSlot,
  FancyTableDragButtonSlot,
} from "../fancy-table.slots";
import { extractStyleProps } from "@/utils/extractStyleProps";
import type { FancyTableRowProps } from "../fancy-table.types";

export const FancyTableRow = React.forwardRef<
  HTMLTableRowElement,
  FancyTableRowProps
>(({ columns, renderCell, item, children, ...props }, ref) => {
  const [styleProps, restProps] = extractStyleProps(props);
  const { selectionBehavior, allowsDragging } = useTableOptions();

  return (
    <FancyTableRowSlot asChild {...styleProps}>
      <Row ref={ref} {...restProps}>
        {/* Drag handle column */}
        {allowsDragging && (
          <FancyTableCellSlot asChild>
            <Cell>
              <FancyTableDragButtonSlot asChild>
                <Button slot="drag" aria-label="Drag to reorder">
                  ⋮⋮
                </Button>
              </FancyTableDragButtonSlot>
            </Cell>
          </FancyTableCellSlot>
        )}

        {/* Selection checkbox column */}
        {selectionBehavior === "toggle" && (
          <FancyTableCellSlot asChild>
            <Cell>
              <FancyTableCheckboxSlot asChild>
                <Checkbox slot="selection" />
              </FancyTableCheckboxSlot>
            </Cell>
          </FancyTableCellSlot>
        )}

        {/* Data cells */}
        {columns && renderCell && item ? (
          <Collection items={columns}>
            {(column) => (
              <FancyTableCellSlot asChild key={column.id}>
                <Cell>{renderCell(item, column)}</Cell>
              </FancyTableCellSlot>
            )}
          </Collection>
        ) : (
          children && <Collection>{children}</Collection>
        )}
      </Row>
    </FancyTableRowSlot>
  );
});

FancyTableRow.displayName = "FancyTableRow";
