import { GridListItem } from "react-aria-components";
import { Close, DragIndicator } from "@commercetools/nimbus-icons";
import { Checkbox, IconButton } from "@/components";
import {
  DraggableListItemSlot,
  DraggableListItemContentSlot,
} from "../draggable-list.slots";
import type {
  DraggableListItemData,
  DraggableListItemProps,
} from "../draggable-list.types";

export const DraggableListItem = <T extends DraggableListItemData>({
  children,
  id,
  onRemoveItem,
  textValue: textValueFromProps,
  ...restProps
}: DraggableListItemProps<T>) => {
  const defaultTextValue = typeof children === "string" ? children : undefined;
  return (
    <DraggableListItemSlot {...restProps} asChild>
      <GridListItem id={id} textValue={textValueFromProps ?? defaultTextValue}>
        {({ allowsDragging, selectionBehavior, selectionMode }) => (
          <>
            {allowsDragging && (
              // @ts-expect-error slot="drag" handles adding the required props
              <IconButton
                slot="drag"
                size="2xs"
                variant="ghost"
                flex="0 0 auto"
              >
                <DragIndicator />
              </IconButton>
            )}
            {selectionMode === "multiple" && selectionBehavior === "toggle" && (
              <Checkbox slot="selection" />
            )}
            <DraggableListItemContentSlot>
              {children}
            </DraggableListItemContentSlot>
            {onRemoveItem && (
              <IconButton
                // TODO: intl label here
                aria-label="remove item"
                size="2xs"
                variant="ghost"
                onPress={id ? () => onRemoveItem(id) : undefined}
                flex="0 0 auto"
              >
                <Close />
              </IconButton>
            )}
          </>
        )}
      </GridListItem>
    </DraggableListItemSlot>
  );
};
