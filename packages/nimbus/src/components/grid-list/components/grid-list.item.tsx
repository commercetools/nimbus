import { GridListItem as RaGridListItem } from "react-aria-components";
import { DragIndicator } from "@commercetools/nimbus-icons";
import { Checkbox } from "@/components/checkbox/checkbox";
import { IconButton } from "@/components/icon-button/icon-button";
import { extractStyleProps } from "@/utils";
import { GridListItemSlot, GridListItemContentSlot } from "../grid-list.slots";
import type { GridListItemProps } from "../grid-list.types";
import { useGridListContext } from "./grid-list.context";

// The drag handle scales with the GridList size.
const dragHandleSizes = { sm: "2xs", md: "xs", lg: "md" } as const;

/**
 * GridList.Item - An individual item with free content.
 *
 * Wraps React Aria's `GridListItem`. Can show a built-in selection checkbox
 * (only with `selectionMode="multiple"`) and a drag handle (only when dragging
 * is enabled through `dragAndDropHooks`). Both default to the setting on
 * `GridList.Root` and can be overridden here. The controls come first, then
 * the content.
 *
 * @example
 * ```tsx
 * <GridList.Item id="1" textValue="Mountain" showSelectionCheckbox>
 *   <Text>Mountain</Text>
 * </GridList.Item>
 * ```
 *
 * @supportsStyleProps
 */
export function GridListItem<T extends object>({
  children,
  ref,
  showSelectionCheckbox,
  showDragHandle,
  ...props
}: GridListItemProps<T>) {
  const context = useGridListContext();
  const { textValue: textValueProp, ...remainingProps } = props;
  const [styleProps, restProps] = extractStyleProps(remainingProps);
  const textValue =
    textValueProp ?? (typeof children === "string" ? children : undefined);
  const withCheckbox = showSelectionCheckbox ?? context.showSelectionCheckbox;
  const withDragHandle = showDragHandle ?? context.showDragHandle;

  return (
    <GridListItemSlot {...styleProps} asChild>
      <RaGridListItem ref={ref} {...restProps} textValue={textValue}>
        {(renderProps) => {
          const content =
            typeof children === "function" ? children(renderProps) : children;
          return (
            <>
              {withDragHandle && renderProps.allowsDragging && (
                <IconButton
                  slot="drag"
                  size={dragHandleSizes[context.size ?? "md"]}
                  variant="ghost"
                  colorPalette="neutral"
                >
                  <DragIndicator />
                </IconButton>
              )}
              {withCheckbox && renderProps.selectionMode === "multiple" && (
                <Checkbox slot="selection" />
              )}
              <GridListItemContentSlot>{content}</GridListItemContentSlot>
            </>
          );
        }}
      </RaGridListItem>
    </GridListItemSlot>
  );
}

GridListItem.displayName = "GridList.Item";
