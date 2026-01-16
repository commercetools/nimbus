import { GridListItem } from "react-aria-components";
import { Close, DragIndicator } from "@commercetools/nimbus-icons";
import { Checkbox, IconButton } from "@/components";
import { extractStyleProps } from "@/utils";
import { useLocalizedStringFormatter } from "@/hooks";
import { draggableListMessagesStrings } from "../draggable-list.messages";
import {
  DraggableListItemSlot,
  DraggableListItemContentSlot,
} from "../draggable-list.slots";
import type {
  DraggableListItemData,
  DraggableListItemProps,
} from "../draggable-list.types";

/**
 * DraggableList.Item - An individual draggable item within the list
 *
 * Handles drag interactions and provides visual feedback during dragging.
 * Supports optional removal with remove button.
 *
 * @supportsStyleProps
 */
export const DraggableListItem = <T extends DraggableListItemData>({
  children,
  id,
  onRemoveItem,
  textValue: textValueFromProps,
  ...restProps
}: DraggableListItemProps<T>) => {
  const msg = useLocalizedStringFormatter(draggableListMessagesStrings);
  const defaultTextValue = typeof children === "string" ? children : undefined;
  const [styleProps, functionalProps] = extractStyleProps(restProps);
  return (
    <DraggableListItemSlot {...styleProps} asChild>
      <GridListItem
        id={id}
        textValue={textValueFromProps ?? defaultTextValue}
        {...functionalProps}
      >
        {({ allowsDragging, selectionBehavior, selectionMode }) => (
          <>
            {allowsDragging && (
              <IconButton
                slot="drag"
                size="2xs"
                variant="ghost"
                flex="0 0 auto"
                colorPalette="neutral"
              >
                <DragIndicator />
              </IconButton>
            )}
            {selectionMode === "multiple" && selectionBehavior === "toggle" && (
              <Checkbox flex="0 0 auto" slot="selection" />
            )}
            <DraggableListItemContentSlot>
              {children}
            </DraggableListItemContentSlot>
            {onRemoveItem && (
              <IconButton
                aria-label={msg.format("removeButtonLabel")}
                size="2xs"
                variant="ghost"
                onPress={id ? () => onRemoveItem(id) : undefined}
                flex="0 0 auto"
                colorPalette="neutral"
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

DraggableListItem.displayName = "DraggableList.Item";
